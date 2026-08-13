#!/usr/bin/env node

import { main } from '../src/launcher.js';

process.exitCode = await main();
