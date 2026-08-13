import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const LAUNCHER_HELP = `dsh-web-launcher

Start the DeepSeek Harness Web UI with one command on Windows, macOS, or Linux.

Usage:
  dsh                         Start the Web UI with default settings
  dsh --port 8080             Forward options to \"dsh web\"
  dsh web --port 8080         Explicit form; also supported
  dsh plugin <arguments...>   Run the official plugin command
  dsh --profile <name> ...    Run an official named profile
  dsh --dsh-raw <arguments>   Forward directly to the official CLI

Launcher options:
  --launcher-help             Show this help
  --launcher-version          Show the launcher version
`;

/**
 * Convert the wrapper arguments into arguments for the official dsh CLI.
 * Ordinary flags target the Web UI. Explicit official commands stay intact.
 */
export function buildOfficialArgs(args) {
  const forwarded = [...args];
  const first = forwarded[0];

  if (first === '--dsh-raw') {
    return forwarded.slice(1);
  }

  if (
    first === 'web'
    || first === 'plugin'
    || first === '--profile'
    || first?.startsWith('--profile=')
  ) {
    return forwarded;
  }

  return ['web', ...forwarded];
}

/** Resolve the real JavaScript entry point shipped by @deepseek-ai/dsh. */
export async function resolveOfficialEntry(env = process.env) {
  if (env.DSH_WEB_CLI_ENTRY) {
    return resolve(env.DSH_WEB_CLI_ENTRY);
  }

  let packagePath;
  try {
    packagePath = require.resolve('@deepseek-ai/dsh/package.json');
  } catch (error) {
    throw new Error(
      'Cannot find @deepseek-ai/dsh. Reinstall this launcher with "npm install -g .".',
      { cause: error },
    );
  }

  const metadata = JSON.parse(await readFile(packagePath, 'utf8'));
  const bin = typeof metadata.bin === 'string' ? metadata.bin : metadata.bin?.dsh;

  if (!bin) {
    throw new Error('The installed @deepseek-ai/dsh package does not expose a dsh executable.');
  }

  return resolve(dirname(packagePath), bin);
}

export async function launcherVersion() {
  const metadata = JSON.parse(await readFile(resolve(projectRoot, 'package.json'), 'utf8'));
  return metadata.version;
}

/** Run the official CLI through Node, without platform-specific shell quoting. */
export async function runOfficialCli(args, options = {}) {
  const entry = await resolveOfficialEntry(options.env);
  const officialArgs = buildOfficialArgs(args);

  return await new Promise((resolveExitCode, reject) => {
    const child = spawn(process.execPath, [entry, ...officialArgs], {
      cwd: options.cwd ?? process.cwd(),
      env: options.env ?? process.env,
      stdio: options.stdio ?? 'inherit',
      windowsHide: true,
    });

    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (typeof code === 'number') {
        resolveExitCode(code);
        return;
      }

      const signalExitCodes = { SIGINT: 130, SIGTERM: 143, SIGHUP: 129 };
      resolveExitCode(signalExitCodes[signal] ?? 1);
    });
  });
}

export async function main(args = process.argv.slice(2), options = {}) {
  if (args.includes('--launcher-help')) {
    (options.stdout ?? process.stdout).write(LAUNCHER_HELP);
    return 0;
  }

  if (args.includes('--launcher-version')) {
    (options.stdout ?? process.stdout).write(`${await launcherVersion()}\n`);
    return 0;
  }

  try {
    return await runOfficialCli(args, options);
  } catch (error) {
    (options.stderr ?? process.stderr).write(`dsh: ${error.message}\n`);
    return 1;
  }
}
