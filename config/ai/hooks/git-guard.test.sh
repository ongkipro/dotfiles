#!/usr/bin/env bash
# Regression check for git-guard.sh. Run it after touching the guard:
#   ./config/ai/hooks/git-guard.test.sh
# Exits non-zero on the first behaviour change. Needs jq.
set -u

guard="$(cd "$(dirname "$0")" && pwd)/git-guard.sh"
[ -x "$guard" ] || { echo "not executable: $guard" >&2; exit 2; }

# <expected decision><TAB><command>. "allow" means the guard stays silent.
# No comments inside the block below — the parser reads every line as a case.
#
# Keep variant spellings alongside canonical ones. Five bypasses reached
# production precisely because every case here was canonical: short-flag
# bundling (-fu), an empty source refspec (:branch), quoting, and a NAME=value
# prefix each evaded a token-shaped match while the suite stayed green.
cases=$(cat <<'CASES'
allow	git push
allow	git push origin main
allow	git -C /tmp push
allow	git commit -m "no amend"
allow	git log --oneline
allow	ls -f /tmp
allow	git push -u origin main
allow	git push origin main:main
allow	git push --follow-tags
deny	git push --force
deny	git push origin main --force-with-lease
deny	git push -f origin main
deny	git -C /tmp push --force
deny	git -c user.name=x commit --amend
deny	git commit --amend -m fix
deny	cd /tmp && git push --force
deny	(git push --force)
deny	git push -fu origin main
deny	git push -qf origin main
deny	GIT_DIR=.git git push --force
deny	FOO=1 git commit --amend
ask	git push origin :feature
ask	git push origin '+main:main'
ask	git push origin --delete feature
ask	git push origin +main:main
ask	git push --mirror
ask	git push origin +main
ask	git push origin +refs/heads/main
deny	/usr/bin/git push --force
deny	/usr/bin/git commit --amend
deny	./git push -f origin main
deny	\git push --force
deny	\git commit --amend
deny	GIT_DIR=.git /usr/bin/git push --force
allow	/usr/bin/git push origin main
allow	mygit push --force
allow	git push -o ci.variable=X=+1 origin main
allow	git push -o merge_request.title=Draft: +1 fix origin main
allow	git push origin main -o skip +ci
allow	git push origin main -m Bump version +1
allow	git push origin release/1.0+build.5
allow	git push git+ssh://host/repo main
ask	git push -o some.opt=x origin +main:main
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
