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
const { run: runConvert } = require('../src/convert');

const { version } = require('../package.json');

program
  .version(version)
  .arguments('<analyze|convert> [options] patterns...', '', { isDefault: true })
  .option('-e, --eol [type]', 'sets the EOL type to convert to, either "windows" or "unix". Defaults to "unix', 'unix')
  .parse(process.argv);

const [ command, ...filePatterns ] = program.args;
if (filePatterns.length === 0) {
  console.error('You must supply at least one file pattern');
  process.exit(-1);
}
switch(command) {
  case 'a':
  case 'analyze':
    runAnalzye(filePatterns);
    break;
  case 'c':
  case 'convert':
    if (program.eol !== 'windows' && program.eol != 'unix') {
      console.error(`Invalid EOL option "${program.eol}"`);
      process.exit(-1);
    }
    runConvert(program.eol, filePatterns);
    break;
  default:
    console.error(`Unknown command "${command}"`);
}
