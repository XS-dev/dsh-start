# dsh-web-launcher

使用一个 `dsh` 命令，在 Windows、macOS 和 Linux 上启动 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI。

本项目替代仅适用于 Windows 的 `dsh-web.cmd`。安装后由 npm 根据操作系统自动生成正确的命令入口，不需要分别维护 `.cmd`、PowerShell 和 Shell 脚本。

## 功能

- `dsh` 直接启动 Web UI。
- 所有 Web UI 参数原样透传，例如端口和配置参数。
- 兼容原来的显式写法 `dsh web ...`。
- 保留官方 `plugin` 和 `--profile` 高级入口。
- 不通过 Shell 拼接命令，避免 Windows、macOS、Linux 参数转义差异。
- 运行目录会原样传给 Harness，因此可以在目标项目目录中直接执行 `dsh`。

## 环境要求

- Node.js `22.19.0+` 或 `24+`
- npm

Node.js 版本要求与当前 DeepSeek Harness 保持一致。

## 安装

### 从 GitHub 安装

```bash
npm install --global github:<你的GitHub用户名>/dsh-web-launcher
```

### 克隆后安装

```bash
git clone https://github.com/<你的GitHub用户名>/dsh-web-launcher.git
cd dsh-web-launcher
npm ci
npm install --global .
```

### 未来发布到 npm 后安装

```bash
npm install --global dsh-web-launcher
```

如果 npm 上该包名已被占用，请先在 `package.json` 中换成自己的作用域包名，例如 `@your-name/dsh-web-launcher`。命令名仍然可以保持为 `dsh`。

## 使用

```bash
# 在当前项目目录启动，默认地址通常为 http://127.0.0.1:3080
dsh

# 指定端口
dsh --port 8080

# 与官方显式命令兼容
dsh web --port 8080

# 管理官方 profile 插件
dsh plugin --profile web list

# 使用其他官方 profile
dsh --profile headless "summarize this repository"

# 完全绕过默认 Web 路由，直接向官方 CLI 传参
dsh --dsh-raw --help

# 查看包装器帮助和版本
dsh --launcher-help
dsh --launcher-version
```

按 `Ctrl+C` 停止服务。

## 工作原理

`package.json` 将 `dsh` 注册为 npm 可执行命令。入口程序定位项目依赖中的 `@deepseek-ai/dsh`，然后使用当前 Node.js 进程直接运行其官方 JavaScript CLI：

```text
dsh [Web 参数]
  └─ node <@deepseek-ai/dsh 官方入口> web [Web 参数]
```

因为没有通过 `cmd.exe`、PowerShell 或 `/bin/sh` 拼接参数，所以路径空格、引号及平台差异由 Node.js 统一处理。

## 开发与验证

```bash
npm ci
npm run check
npm test
npm run test:coverage
npm pack --dry-run
```

GitHub Actions 会在 Windows、macOS、Ubuntu 以及 Node.js 22、24 上运行检查。

## 发布到 GitHub

```bash
git remote add origin https://github.com/<你的GitHub用户名>/dsh-web-launcher.git
git push -u origin main
```

如需发布到 npm：

```bash
npm login
npm publish
```

## 安全说明

DeepSeek Harness 可以读取和修改启动目录下的文件并执行命令。请从需要操作的项目目录启动，并在 Web UI 中核对工作区和审批策略。API 密钥应通过 Harness 的模型设置保存，不要写入本项目或提交到 Git。

## License

[MIT](LICENSE)
