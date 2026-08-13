# dsh-start

[![CI](https://github.com/XS-dev/dsh-start/actions/workflows/ci.yml/badge.svg)](https://github.com/XS-dev/dsh-start/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22.19%2B%20%7C%2024%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

English | [简体中文](README.zh-CN.md)

Start the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI with a single `dsh` command on Windows, macOS, and Linux.

```console
$ dsh
dsh web: http://127.0.0.1:3080
```

> [!NOTE]
> This is an independent community launcher and is not an official DeepSeek project.

## Why dsh-start?

The official CLI uses `dsh web` to launch the browser interface. `dsh-start` makes Web UI startup the default while preserving access to the official CLI's explicit commands.

- Run `dsh` instead of `dsh web`.
- Forward Web UI options without platform-specific quoting.
- Keep `dsh web`, `dsh plugin`, and `dsh --profile` compatible.
- Install the same executable on Windows, macOS, and Linux through npm.
- Use the directory where `dsh` is invoked as the Harness workspace root.

## Requirements

- Node.js `^22.19.0` or `>=24.0.0`
- npm

## Install

Install the latest version directly from GitHub:

```bash
npm install --global github:XS-dev/dsh-start
```

Verify the launcher:

```bash
dsh --launcher-version
```

## Usage

### Start and open the Web UI

Run the launcher from the project directory you want Harness to use:

```bash
dsh
```

The default port is **3080**. When the terminal prints:

```text
dsh web: http://127.0.0.1:3080
```

open [http://127.0.0.1:3080](http://127.0.0.1:3080) in your browser. Keep the terminal running while using the Web UI, and press `Ctrl+C` when you want to stop the service.

By default, the server listens on the local machine only. If you choose another port, open the same address with that port—for example, `dsh --port 8080` is available at [http://127.0.0.1:8080](http://127.0.0.1:8080).

### More commands

```bash
# Start it on another port
dsh --port 8080

# The official explicit form remains valid
dsh web --port 8080

# Manage plugins for an official profile
dsh plugin --profile web list

# Run another official profile
dsh --profile headless "summarize this repository"

# Forward arguments directly to the official CLI
dsh --dsh-raw --help

# Show launcher-specific help
dsh --launcher-help
```

### Command routing

| Input | Forwarded to DeepSeek Harness |
|---|---|
| `dsh` | `dsh web` |
| `dsh --port 8080` | `dsh web --port 8080` |
| `dsh web ...` | unchanged |
| `dsh plugin ...` | unchanged |
| `dsh --profile ...` | unchanged |
| `dsh --dsh-raw ...` | arguments after `--dsh-raw` |

## How it works

The npm `bin` field creates the appropriate `dsh` executable for the host operating system. The launcher resolves the installed `@deepseek-ai/dsh` JavaScript entry point and starts it directly with Node.js. It does not construct a command through `cmd.exe`, PowerShell, or `/bin/sh`, avoiding shell-specific quoting behavior.

## Security

DeepSeek Harness can read and modify files in the selected workspace and execute commands subject to its permission policy. Start `dsh` from the project you intend to work on, verify the workspace shown in the Web UI, and review approval prompts before allowing sensitive operations.

Keep API keys in the Harness model settings or another appropriate secret store. Never commit credentials to this repository or to a workspace used by an agent.

## Development

```bash
git clone https://github.com/XS-dev/dsh-start.git
cd dsh-start
npm ci
npm run check
npm test
npm pack --dry-run
```

CI runs on Windows, macOS, and Ubuntu with Node.js 22 and 24.

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a change.

## License

[MIT](LICENSE)
