# Copilot Instructions

- Use only free and open source tooling in workflows (avoid proprietary services like Docker Desktop; prefer community alternatives).
- Docker tasks must assume the project runs on **Colima**, not Docker Desktop. Use commands like `colima start`/`colima stop` when documenting workflows.
- BuildKit cache mounts require the open source `docker-buildx` CLI plugin. Install via Homebrew (`brew install docker-buildx`) if a build complains about missing BuildKit support.
- Prefer arm64-compatible base images and multi-arch workflows since deployments target an ARM-based environment (Raspberry Pi 5 via Coolify).
