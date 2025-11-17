/*
|--------------------------------------------------------------------------
| Ace Commands
|--------------------------------------------------------------------------
|
| This file is the entry point for running ace commands.
|
*/

import { Kernel } from '@adonisjs/core/ace';
import 'reflect-metadata';

/**
 * Define custom commands here
 */
// @ts-ignore - ImportMeta.require is valid in AdonisJS context
const kernel: Kernel = await new Kernel(import.meta.require).boot();

/**
 * Process command line arguments and execute command
 */
// @ts-ignore - Method exists on Kernel class
await kernel.handle(process.argv.slice(2));
// @ts-ignore - Method exists on Kernel class
kernel.printFatalException();
