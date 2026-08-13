import assert from 'node:assert/strict';
import { mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import {
  buildOfficialArgs,
  LAUNCHER_HELP,
  main,
  runOfficialCli,
} from '../src/launcher.js';

test('no arguments start the web profile', () => {
  assert.deepEqual(buildOfficialArgs([]), ['web']);
});

test('ordinary options are forwarded to the web profile', () => {
  assert.deepEqual(buildOfficialArgs(['--port', '8080']), ['web', '--port', '8080']);
});

test('an explicit web command remains compatible', () => {
  assert.deepEqual(buildOfficialArgs(['web', '--port', '8080']), ['web', '--port', '8080']);
});

test('official plugin commands are not rewritten', () => {
  assert.deepEqual(
    buildOfficialArgs(['plugin', '--profile', 'web', 'list']),
    ['plugin', '--profile', 'web', 'list'],
  );
});

test('official profile commands are not rewritten', () => {
  assert.deepEqual(
    buildOfficialArgs(['--profile', 'headless', 'check the project']),
    ['--profile', 'headless', 'check the project'],
  );
  assert.deepEqual(
    buildOfficialArgs(['--profile=headless', 'check the project']),
    ['--profile=headless', 'check the project'],
  );
});

test('--dsh-raw removes only the wrapper escape hatch', () => {
  assert.deepEqual(buildOfficialArgs(['--dsh-raw', '--help']), ['--help']);
});

test('--launcher-help does not require the official package at runtime', async () => {
  let output = '';
  const exitCode = await main(['--launcher-help'], {
    stdout: { write: (chunk) => { output += chunk; } },
  });

  assert.equal(exitCode, 0);
  assert.equal(output, LAUNCHER_HELP);
  assert.match(output, /Windows, macOS, or Linux/);
});

test('--launcher-version reads the package version', async () => {
  let output = '';
  const exitCode = await main(['--launcher-version'], {
    stdout: { write: (chunk) => { output += chunk; } },
  });

  assert.equal(exitCode, 0);
  assert.equal(output, '1.0.0\n');
});

test('the launcher executes the official entry without a platform shell', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-start-'));
  const fakeEntry = join(directory, 'fake-dsh.js');
  const resultPath = join(directory, 'result.json');

  try {
    await writeFile(
      fakeEntry,
      "import { writeFile } from 'node:fs/promises';\n"
        + "await writeFile(process.env.RESULT_PATH, JSON.stringify({ args: process.argv.slice(2), cwd: process.cwd() }));\n",
      'utf8',
    );

    const exitCode = await runOfficialCli(['--port', '8080'], {
      cwd: directory,
      env: {
        ...process.env,
        DSH_WEB_CLI_ENTRY: fakeEntry,
        RESULT_PATH: resultPath,
      },
      stdio: 'ignore',
    });

    const result = JSON.parse(await readFile(resultPath, 'utf8'));
    assert.equal(exitCode, 0);
    assert.deepEqual(result.args, ['web', '--port', '8080']);
    assert.equal(result.cwd, await realpath(directory));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
