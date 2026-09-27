# Artifact CRT redesign

The Artifacts section was redesigned around a physical CRT monitor + separate keyboard.

Preview behavior:
- `previewUrl` renders a project hero/site inside the CRT when available.
- `previewImage` can be used instead for a static screenshot.
- If neither exists, the monitor shows a restrained project-cover fallback.

To add screenshots later, put them in `public/artifacts/` and set for example:
`previewImage: '/artifacts/slideshell.webp'`
