# wsl-tools.sh — WSL2-specific bashrc additions
# Idempotent (aman di-source berkali-kali). Pakai dari install.sh atau manual:
#   echo 'source ~/dotfiles/config/wsl-tools.sh' >> ~/.bashrc
# >>> WSL optimizations (ongki/dotfiles) >>>

# Clipboard helpers (WSL ↔ Windows)
command -v clip.exe >/dev/null && alias clipout='clip.exe'
command -v powershell.exe >/dev/null && alias clipin='powershell.exe -NoProfile -Command "Get-Clipboard"'

# WSL path conversion
command -v wslpath >/dev/null && {
  alias wpath='wslpath -w'
  alias upath='wslpath -u'
}

# Open in Windows default handler (uses helper if present, else fallback)
if [ -x "$HOME/.local/bin/wsl-open" ]; then
  alias open='wsl-open'
fi
command -v explorer.exe >/dev/null && alias explorer='explorer.exe'

# WSL info shortcut
[ -x "$HOME/.local/bin/wsl-info" ] && alias wsl='wsl-info'

# WSL env: force modern terminal
export TERM="${TERM:-xterm-256color}"
export COLORTERM="${COLORTERM:-truecolor}"
export FORCE_COLOR=1

# Clear noisy Windows env vars (break some Linux tools)
unset NO_PROXY HTTP_PROXY HTTPS_PROXY 2>/dev/null || true

# XDG base dirs
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_CACHE_HOME="$HOME/.cache"

# Forward Windows OpenSSH agent to WSL (common pattern)
if [ -z "${SSH_AUTH_SOCK:-}" ] && [ -S "/mnt/c/Users/${USER}/.ssh/agent.sock" ]; then
  export SSH_AUTH_SOCK="/mnt/c/Users/${USER}/.ssh/agent.sock"
fi

# Distro name (helpful when running multiple distros)
export WSL_DISTRO_NAME
WSL_DISTRO_NAME=$(grep ^NAME /etc/os-release 2>/dev/null | cut -d= -f2 | tr -d '"')

# Quick reload of bashrc
alias reload='source ~/.bashrc && echo "✓ bashrc reloaded"'

# Project dir shortcut
alias proj='cd ~/Projects 2>/dev/null || cd ~/projects 2>/dev/null || echo "~/Projects not found"'

# Shopify CLI shortcut (because it's used a lot)
command -v shopify >/dev/null && alias shopi='shopify'

# Cleanup WSL temp files (frees /tmp space)
wsl-cleanup() {
  find /tmp -maxdepth 1 -type f -atime +1 -delete 2>/dev/null
  find /tmp -maxdepth 1 -type d -empty -mtime +1 -delete 2>/dev/null
  echo "✓ /tmp cleaned"
}

# Windows Terminal touchscreen -> VT mouse bridge (for tmux pane focus, drag-copy & scroll)
_wt_touch_bridge_start() {
  local csc="/mnt/c/Windows/Microsoft.NET/Framework64/v4.0.30319/csc.exe"
  [ -x "$csc" ] || return 0
  local win_temp="/mnt/c/Users/${USER}/AppData/Local/Temp"
  if [ ! -d "$win_temp" ]; then
    win_temp="$(find /mnt/c/Users -maxdepth 4 -type d -path '*/AppData/Local/Temp' 2>/dev/null | head -n 1)"
  fi
  [ -n "$win_temp" ] && [ -d "$win_temp" ] || return 0
  local bdir="$win_temp/wt-touch-bridge"
  local cs="$bdir/WtTouchBridge.cs"
  local exe="$bdir/WtTouchBridge.exe"
  mkdir -p "$bdir" 2>/dev/null || return 0
  if [ ! -f "$exe" ] || [ "${BASH_SOURCE[0]}" -nt "$exe" ]; then
    cat > "$cs" << 'EOF'
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Windows.Forms;

public class WtTouchBridge : Form {
    [StructLayout(LayoutKind.Sequential)]
    public struct RAWINPUTDEVICE {
        public ushort usUsagePage;
        public ushort usUsage;
        public uint dwFlags;
        public IntPtr hwndTarget;
    }
    [StructLayout(LayoutKind.Sequential)]
    public struct POINT { public int X, Y; }
    [StructLayout(LayoutKind.Sequential)]
    public struct RECT { public int Left, Top, Right, Bottom; }
    [StructLayout(LayoutKind.Sequential)]
    public struct HIDP_CAPS {
        public ushort Usage, UsagePage, InputReportByteLength, OutputReportByteLength, FeatureReportByteLength;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 17)] public ushort[] Reserved;
        public ushort NumberLinkCollectionNodes, NumberInputButtonCaps, NumberInputValueCaps, NumberInputDataIndices;
        public ushort NumberOutputButtonCaps, NumberOutputValueCaps, NumberOutputDataIndices;
        public ushort NumberFeatureButtonCaps, NumberFeatureValueCaps, NumberFeatureDataIndices;
    }
    [StructLayout(LayoutKind.Sequential)]
    public struct HIDP_VALUE_CAPS {
        public ushort UsagePage;
        public byte ReportID;
        [MarshalAs(UnmanagedType.U1)] public bool IsAlias;
        public ushort BitField, LinkCollection, LinkUsage, LinkUsagePage;
        [MarshalAs(UnmanagedType.U1)] public bool IsRange, IsStringRange, IsDesignatorRange, IsAbsolute, HasNull;
        public byte Reserved;
        public ushort BitSize, ReportCount;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 5)] public ushort[] Reserved2;
        public uint UnitsExp, Units;
        public int LogicalMin, LogicalMax, PhysicalMin, PhysicalMax;
        public ushort UsageMin, UsageMax, StringMin, StringMax, DesignatorMin, DesignatorMax, DataIndexMin, DataIndexMax;
    }

    [DllImport("user32.dll")] static extern bool SetProcessDPIAware();
    [DllImport("user32.dll")] static extern int GetSystemMetrics(int nIndex);
    [DllImport("user32.dll", SetLastError = true)] static extern bool RegisterRawInputDevices(RAWINPUTDEVICE[] pRawInputDevices, uint uiNumDevices, uint cbSize);
    [DllImport("user32.dll")] static extern uint GetRawInputData(IntPtr hRawInput, uint uiCommand, IntPtr pData, ref uint pcbSize, uint cbSizeHeader);
    [DllImport("user32.dll")] static extern uint GetRawInputDeviceInfo(IntPtr hDevice, uint uiCommand, IntPtr pData, ref uint pcbSize);
    [DllImport("user32.dll")] static extern IntPtr WindowFromPoint(POINT Point);
    [DllImport("user32.dll")] static extern IntPtr GetAncestor(IntPtr hwnd, uint gaFlags);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);
    [DllImport("user32.dll")] static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
    [DllImport("user32.dll")] static extern bool SetCursorPos(int X, int Y);
    [DllImport("user32.dll")] static extern void mouse_event(uint dwFlags, int dx, int dy, uint dwData, UIntPtr dwExtraInfo);

    [DllImport("hid.dll")] static extern int HidP_GetCaps(IntPtr preparsed, out HIDP_CAPS caps);
    [DllImport("hid.dll")] static extern int HidP_GetValueCaps(int reportType, [In, Out] HIDP_VALUE_CAPS[] valueCaps, ref ushort len, IntPtr preparsed);
    [DllImport("hid.dll")] static extern int HidP_GetUsages(int reportType, ushort usagePage, ushort linkCollection, [In, Out] ushort[] usageList, ref uint usageLength, IntPtr preparsed, IntPtr report, uint reportLength);
    [DllImport("hid.dll")] static extern int HidP_GetUsageValue(int reportType, ushort usagePage, ushort linkCollection, ushort usage, out uint value, IntPtr preparsed, IntPtr report, uint reportLength);

    class DevInfo {
        public IntPtr Preparsed;
        public int MaxX = 11440;
        public int MaxY = 7148;
    }

    Dictionary<IntPtr, DevInfo> _devs = new Dictionary<IntPtr, DevInfo>();
    bool _active = false;
    bool _multiTouch = false;
    int _mode = 0; // 0 = tap, 1 = drag, 2 = scroll
    int _startX, _startY, _lastX, _lastY;
    int _lastTapTick = 0, _lastTapX = 0, _lastTapY = 0;

    protected override void SetVisibleCore(bool value) {
        base.SetVisibleCore(false);
        if (!IsHandleCreated) {
            CreateHandle();
            var rid = new RAWINPUTDEVICE[1];
            rid[0].usUsagePage = 0x000D;
            rid[0].usUsage = 0x0004;
            rid[0].dwFlags = 0x00000100; // RIDEV_INPUTSINK
            rid[0].hwndTarget = Handle;
            RegisterRawInputDevices(rid, 1, (uint)Marshal.SizeOf(typeof(RAWINPUTDEVICE)));
        }
    }

    DevInfo GetDev(IntPtr hDev) {
        DevInfo d;
        if (_devs.TryGetValue(hDev, out d)) return d;
        d = new DevInfo();
        uint sz = 0;
        GetRawInputDeviceInfo(hDev, 0x20000005, IntPtr.Zero, ref sz);
        if (sz > 0) {
            d.Preparsed = Marshal.AllocHGlobal((int)sz);
            if (GetRawInputDeviceInfo(hDev, 0x20000005, d.Preparsed, ref sz) != uint.MaxValue) {
                HIDP_CAPS caps;
                if (HidP_GetCaps(d.Preparsed, out caps) == 0x00110000 && caps.NumberInputValueCaps > 0) {
                    ushort vlen = caps.NumberInputValueCaps;
                    var vcaps = new HIDP_VALUE_CAPS[vlen];
                    if (HidP_GetValueCaps(0, vcaps, ref vlen, d.Preparsed) == 0x00110000) {
                        for (int i = 0; i < vlen; i++) {
                            if (vcaps[i].LinkCollection == 1 && vcaps[i].UsagePage == 0x01) {
                                if (vcaps[i].UsageMin == 0x30 && vcaps[i].LogicalMax > 0) d.MaxX = vcaps[i].LogicalMax;
                                if (vcaps[i].UsageMin == 0x31 && vcaps[i].LogicalMax > 0) d.MaxY = vcaps[i].LogicalMax;
                            }
                        }
                    }
                }
            }
        }
        _devs[hDev] = d;
        return d;
    }

    bool IsInsideWindowsTerminalCanvas(int px, int py) {
        IntPtr hwnd = WindowFromPoint(new POINT { X = px, Y = py });
        if (hwnd == IntPtr.Zero) return false;
        IntPtr root = GetAncestor(hwnd, 2);
        if (root == IntPtr.Zero) root = hwnd;
        var sb = new StringBuilder(128);
        GetClassName(root, sb, 128);
        if (sb.ToString() != "CASCADIA_HOSTING_WINDOW_CLASS") return false;
        RECT r;
        if (!GetWindowRect(root, out r)) return false;
        return py >= r.Top + 48 && py <= r.Bottom - 8 && px >= r.Left + 8 && px <= r.Right - 20;
    }

    protected override void WndProc(ref Message m) {
        if (m.Msg == 0x00FF) {
            HandleRawInput(m.LParam);
        }
        base.WndProc(ref m);
    }

    void HandleRawInput(IntPtr lParam) {
        uint hdrSize = (uint)(IntPtr.Size == 8 ? 24 : 16);
        uint sz = 0;
        GetRawInputData(lParam, 0x10000003, IntPtr.Zero, ref sz, hdrSize);
        if (sz <= hdrSize) return;
        IntPtr buf = Marshal.AllocHGlobal((int)sz);
        try {
            if (GetRawInputData(lParam, 0x10000003, buf, ref sz, hdrSize) == uint.MaxValue) return;
            int dwType = Marshal.ReadInt32(buf, 0);
            if (dwType != 2) return;
            IntPtr hDev = Marshal.ReadIntPtr(buf, 8);
            uint dwSizeHid = (uint)Marshal.ReadInt32(buf, (int)hdrSize);
            uint dwCount = (uint)Marshal.ReadInt32(buf, (int)hdrSize + 4);
            if (dwSizeHid == 0 || dwCount == 0) return;

            var dev = GetDev(hDev);
            if (dev.Preparsed == IntPtr.Zero) return;

            int screenW = GetSystemMetrics(0);
            int screenH = GetSystemMetrics(1);
            ushort[] usages = new ushort[16];

            for (uint i = 0; i < dwCount; i++) {
                IntPtr rep = IntPtr.Add(buf, (int)hdrSize + 8 + (int)(i * dwSizeHid));
                uint cc;
                if (HidP_GetUsageValue(0, 0x0D, 0, 0x54, out cc, dev.Preparsed, rep, dwSizeHid) == 0x00110000 && cc > 1) {
                    _multiTouch = true;
                    continue;
                }
                uint ulen = (uint)usages.Length;
                bool tip = false;
                if (HidP_GetUsages(0, 0x0D, 1, usages, ref ulen, dev.Preparsed, rep, dwSizeHid) == 0x00110000) {
                    for (uint u = 0; u < ulen; u++) {
                        if (usages[u] == 0x42) { tip = true; break; }
                    }
                }
                uint rx, ry;
                bool hasX = HidP_GetUsageValue(0, 0x01, 1, 0x30, out rx, dev.Preparsed, rep, dwSizeHid) == 0x00110000;
                bool hasY = HidP_GetUsageValue(0, 0x01, 1, 0x31, out ry, dev.Preparsed, rep, dwSizeHid) == 0x00110000;
                int px = hasX ? (int)((long)rx * screenW / dev.MaxX) : _lastX;
                int py = hasY ? (int)((long)ry * screenH / dev.MaxY) : _lastY;

                if (tip) {
                    if (!_active) {
                        if (IsInsideWindowsTerminalCanvas(px, py)) {
                            _active = true;
                            _multiTouch = false;
                            _mode = 0;
                            _startX = _lastX = px;
                            _startY = _lastY = py;
                        }
                    } else if (!_multiTouch) {
                        _lastX = px;
                        _lastY = py;
                        int dx = px - _startX;
                        int dy = py - _startY;
                        if (_mode == 0) {
                            if (Math.Abs(dx) > 24 && Math.Abs(dx) >= Math.Abs(dy)) _mode = 1;
                            else if (Math.Abs(dy) > 32 && Math.Abs(dy) > Math.Abs(dx)) _mode = 2;
                        }
                    }
                } else if (_active) {
                    bool multi = _multiTouch;
                    int sx = _startX, sy = _startY, ex = _lastX, ey = _lastY, mode = _mode;
                    _active = false;
                    _multiTouch = false;
                    if (!multi) {
                        int now = Environment.TickCount;
                        bool isDouble = (mode == 0) && (now - _lastTapTick < 400) && (Math.Abs(ex - _lastTapX) < 35) && (Math.Abs(ey - _lastTapY) < 35);
                        if (mode == 0) {
                            if (isDouble) _lastTapTick = 0;
                            else { _lastTapTick = now; _lastTapX = ex; _lastTapY = ey; }
                        }
                        ThreadPool.QueueUserWorkItem(_ => ReplayMouse(mode, sx, sy, ex, ey, isDouble));
                    }
                }
            }
        } finally {
            Marshal.FreeHGlobal(buf);
        }
    }

    static void ReplayMouse(int mode, int sx, int sy, int ex, int ey, bool isDouble) {
        Thread.Sleep(18);
        if (mode == 0) {
            SetCursorPos(ex, ey);
            mouse_event(0x0002, 0, 0, 0, UIntPtr.Zero);
            Thread.Sleep(8);
            mouse_event(0x0004, 0, 0, 0, UIntPtr.Zero);
            if (isDouble) {
                Thread.Sleep(25);
                mouse_event(0x0002, 0, 0, 0, UIntPtr.Zero);
                Thread.Sleep(8);
                mouse_event(0x0004, 0, 0, 0, UIntPtr.Zero);
            }
        } else if (mode == 1) {
            SetCursorPos(sx, sy);
            mouse_event(0x0002, 0, 0, 0, UIntPtr.Zero);
            Thread.Sleep(20);
            for (int s = 1; s <= 6; s++) {
                int ix = sx + (ex - sx) * s / 6;
                int iy = sy + (ey - sy) * s / 6;
                SetCursorPos(ix, iy);
                mouse_event(0x0001, 1, 0, 0, UIntPtr.Zero);
                Thread.Sleep(8);
            }
            mouse_event(0x0004, 0, 0, 0, UIntPtr.Zero);
        } else if (mode == 2) {
            SetCursorPos(sx, sy);
            mouse_event(0x0002, 0, 0, 0, UIntPtr.Zero);
            Thread.Sleep(8);
            mouse_event(0x0004, 0, 0, 0, UIntPtr.Zero);
            Thread.Sleep(10);
            int notches = (ey - sy) / 28;
            if (notches == 0) notches = (ey > sy) ? 1 : -1;
            uint delta = unchecked((uint)(notches > 0 ? 120 : -120));
            int count = Math.Min(Math.Abs(notches), 12);
            for (int n = 0; n < count; n++) {
                mouse_event(0x0800, 0, 0, delta, UIntPtr.Zero);
                Thread.Sleep(8);
            }
        }
    }

    [STAThread]
    static void Main() {
        bool createdNew;
        using (var mutex = new Mutex(true, "Local\\OngkiWtTouchBridge_v1", out createdNew)) {
            if (!createdNew) return;
            SetProcessDPIAware();
            Application.Run(new WtTouchBridge());
        }
    }
}
EOF
    local win_cs win_exe
    win_cs="$(wslpath -w "$cs")"
    win_exe="$(wslpath -w "$exe")"
    "$csc" /nologo /target:winexe /optimize+ /out:"$win_exe" "$win_cs" >/dev/null 2>&1 || return 0
  fi
  [ -f "$exe" ] && ( "$exe" </dev/null >/dev/null 2>&1 & )
}
_wt_touch_bridge_start
unset -f _wt_touch_bridge_start

# <<< WSL optimizations (ongki/dotfiles) <<<