# Publishing Skills from Astro

This is optional.

Use this only if the project itself should publish Agent Skills from an Astro website.

## When relevant

- your Astro site is also a distribution point for skills
- you want `/.well-known/skills/index.json`
- you want skill discovery over HTTP

## Note

This is separate from using Astro to build websites.
It is a packaging/distribution concern, not a default website requirement.

## Direction

If needed, evaluate an integration such as `astro-skills` and wire it into the Astro project deliberately.
