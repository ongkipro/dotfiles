#!/usr/bin/env bash
# Regression check for git-guard.sh. Run it after touching the guard:
#   ./config/ai/hooks/git-guard.test.sh
# Exits non-zero on the first behaviour change. Needs jq.
set -u

guard="$(cd "$(dirname "$0")" && pwd)/git-guard.sh"
[ -x "$guard" ] || { echo "not executable: $guard" >&2; exit 2; }

# <expected decision><TAB><command>. "allow" means the guard stays silent.
cases=$(cat <<'CASES'
allow	git push
allow	git push origin main
allow	git -C /tmp push
allow	git commit -m "no amend"
allow	git log --oneline
allow	ls -f /tmp
deny	git push --force
deny	git push origin main --force-with-lease
deny	git push -f origin main
deny	git -C /tmp push --force
deny	git -c user.name=x commit --amend
deny	git commit --amend -m fix
deny	cd /tmp && git push --force
deny	(git push --force)
ask	git push origin --delete feature
ask	git push origin +main:main
ask	git push --mirror
CASES
)

# A mention is not an invocation: none of these may trip the guard.
mentions=$(cat <<'CASES'
allow	echo git push --force
allow	grep -n "git commit --amend" notes.md
allow	git commit -m "mentions git push --force in the message"
allow	git push origin main && rm -f /tmp/x
CASES
)

pass=0 fail=0
while IFS="$(printf '\t')" read -r want cmd; do
  [ -n "${want:-}" ] || continue
  out=$(printf '%s' "$cmd" | jq -Rc '{tool_name:"Bash",tool_input:{command:.}}' | "$guard" 2>/dev/null)
  if [ -n "$out" ]; then
    got=$(printf '%s' "$out" | jq -r '.hookSpecificOutput.permissionDecision')
  else
    got=allow
  fi
  if [ "$got" = "$want" ]; then
    pass=$((pass + 1))
  else
    fail=$((fail + 1))
    printf 'FAIL  want=%-6s got=%-6s  %s\n' "$want" "$got" "$cmd" >&2
  fi
done <<EOF
$cases
$mentions
EOF

printf 'git-guard: %d passed, %d failed\n' "$pass" "$fail"
[ "$fail" -eq 0 ]
