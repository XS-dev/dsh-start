# dsh-start

[![CI](https://github.com/XS-dev/dsh-start/actions/workflows/ci.yml/badge.svg)](https://github.com/XS-dev/dsh-start/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22.19%2B%20%7C%2024%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

[English](README.md) | 简体中文

使用一个 `dsh` 命令，在 Windows、macOS 和 Linux 上启动 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI。

```console
> dsh
dsh web: http://127.0.0.1:3080
```

> [!NOTE]
> 这是独立的社区启动器，并非 DeepSeek 官方项目。

## 为什么使用 dsh-start？

官方 CLI 通过 `dsh web` 启动浏览器界面。`dsh-start` 将 Web UI 设为默认启动目标，同时保留官方 CLI 的显式命令。

- 使用 `dsh` 代替 `dsh web`。
- 跨平台透传 Web UI 参数，避免不同 Shell 的转义差异。
- 兼容 `dsh web`、`dsh plugin` 和 `dsh --profile`。
- 通过 npm 在 Windows、macOS 和 Linux 上安装同一个命令。
- 将执行 `dsh` 时所在的目录作为 Harness 工作区根目录。

## 环境要求

- Node.js `^22.19.0` 或 `>=24.0.0`
- npm

## 安装

直接从 GitHub 安装最新版：

```bash
npm install --global github:XS-dev/dsh-start
```

验证安装：

```bash
dsh --launcher-version
```

## 使用

```bash
# 使用默认端口启动 Web UI
dsh

# 指定端口
dsh --port 8080

# 兼容官方显式形式
dsh web --port 8080

# 管理官方 profile 的插件
dsh plugin --profile web list

# 运行其他官方 profile
dsh --profile headless "summarize this repository"

# 参数完全透传给官方 CLI
dsh --dsh-raw --help

# 查看启动器自身的帮助
dsh --launcher-help
```

按 `Ctrl+C` 停止 Web UI。

### 命令路由

| 输入 | 转发给 DeepSeek Harness 的命令 |
|---|---|
| `dsh` | `dsh web` |
| `dsh --port 8080` | `dsh web --port 8080` |
| `dsh web ...` | 原样转发 |
| `dsh plugin ...` | 原样转发 |
| `dsh --profile ...` | 原样转发 |
| `dsh --dsh-raw ...` | 转发 `--dsh-raw` 后面的参数 |

## 工作原理

npm 的 `bin` 字段会为当前操作系统创建对应的 `dsh` 可执行入口。启动器定位已安装的 `@deepseek-ai/dsh` JavaScript 入口，并直接通过 Node.js 运行，不经由 `cmd.exe`、PowerShell 或 `/bin/sh` 拼接命令，因此不依赖特定 Shell 的参数转义规则。

## 安全说明

DeepSeek Harness 可以在权限策略允许的范围内读取、修改选定工作区中的文件并执行命令。请从希望操作的项目目录启动 `dsh`，核对 Web UI 中显示的工作区，并在允许敏感操作前检查审批内容。

API 密钥应保存在 Harness 模型设置或其他合适的密钥存储中。不要将凭据提交到本仓库或 Agent 使用的工作区。

## 开发

```bash
git clone https://github.com/XS-dev/dsh-start.git
cd dsh-start
npm ci
npm run check
npm test
npm pack --dry-run
```

CI 会在 Windows、macOS、Ubuntu 以及 Node.js 22、24 上运行。

## 参与贡献

欢迎提交 Issue 和 Pull Request。提交改动前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

[MIT](LICENSE)
