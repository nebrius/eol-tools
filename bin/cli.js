#!/usr/bin/env node
/*
Copyright (c) 2018 Bryan Hughes <bryan@nebri.us>

This file is part of EOL Tools.

EOL Tools is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

EOL Tools is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with EOL Tools.  If not, see <https://www.gnu.org/licenses/>.
*/

const program = require('commander');
const { run: runAnalzye } = require('../src/analyze');

const { version } = require('../package.json');

program
  .version(version)
  .arguments('<analyze> [pattern...]', 'Searches all files specified and prints their EOL status', { isDefault: true })
  .parse(process.argv);

const [ command, ...args ] = program.args;
switch(command) {
  case 'a':
  case 'analyze':
    runAnalzye(args);
    break;
  default:
    console.error(`Unknown command "${command}"`);
}
