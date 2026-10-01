# Phone capture: ChatGPT "Dotfiles Inbox" → `ai-learn import`

Knowledge is often captured on the phone in ChatGPT, while memory is validated
and stored from the terminal. This page connects the two without a server,
remote MCP, or unreviewed writes (TASK-101).

```text
phone (ChatGPT project) ──copy──▶ terminal: ai-learn import ──▶ local inbox (0600)
                                                  │
                                 ai-learn show / promote --yes (reviewed) ──▶ tracked memory
```

Nothing reaches the public repository until `ai-learn promote ... --yes`, and
promotion still runs the secret and hygiene gates.

## 1. Create the ChatGPT project (once)

Create a project named **Dotfiles Inbox** and paste this as its instructions:

```text
You turn my notes (often informal Indonesian) into ONE lesson block for my
developer knowledge base. Always answer with exactly this block in English and
nothing else:

Title: <short imperative or factual title>
Symptom: <what was observed>
Root cause: <why it happened; write "unknown" if I did not say>
Invariant: <the durable rule that prevents it>
Fix: <what to do>
Check: <a concrete way to verify the fix>
Scope: shared            (or: project)
Project: <slug, only when Scope is project>

Rules: never include passwords, API keys, tokens, customer data, or private
URLs; replace them with a description. Do not invent facts I did not give; mark
gaps as "unknown". If my note is not a lesson (for example a task or an idea),
reply "NOT A LESSON:" followed by one line saying where it belongs.
```

## 2. Import on the terminal

Copy the block from ChatGPT, then:

```bash
ai-learn import          # paste, then Ctrl-D
ai-learn import note.txt # or from a file
ai-learn list
ai-learn show <candidate>
ai-learn promote <candidate> --target shared:development-lessons --yes
```

`import` accepts `**Bold:**` labels, list markers, code fences, and wrapped
lines. It refuses a block that is missing a required field or that looks like
it contains a credential.

## Why not a remote MCP or Kelola sync?

Work happens mainly in the terminal; the phone is for capture only. A paste step
keeps the reviewed-promotion rule, adds no service to secure, and works on every
device that has dotfiles.
