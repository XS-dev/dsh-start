# Contributing

欢迎提交 Issue 和 Pull Request。

提交前请运行：

```bash
npm run check
npm test
npm pack --dry-run
```

改动命令路由时，请为 Windows、macOS 和 Linux 共用的 JavaScript 逻辑补充测试，避免加入依赖特定 Shell 的命令拼接。
