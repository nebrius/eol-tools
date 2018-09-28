# EOL Tools

A set of tools for working with EOL markings in files.

## Installation

Install using npm:

```BASH
npm install -g eol-tools
```

## Usage

At any time, you can run `eol-tools --help` to get help from the command line.

### Analyzing the line endings of files

You can use eol-tools to analyze the EOL markings of files and report back what they are, including mixed EOL usage and indeterminante usage:

```BASH
eol-tools [a|analayze] [<glob pattern>...]
```

Each argument after `a` or `analyze` is treated as a separate glob pattern, so you can do things like this:

```BASH
eol-tools a ./src/**/*.ts ./dist/**/*.js
```

It will print out the results and indicate one of five possible stats:
- None: there were no line endings detected at all, so the EOL type could not be determined. This typically happens on empty files
- UNIX: all EOL markings are `\n`
- Windows: all EOL markings are `\r\n`
- Apple: all EOL markings are `\r` (where did you find this relic?)
- Mixed: there is a cominbination of different markings used in the file

# License

Copyright (c) 2018 Bryan Hughes <bryan@nebri.us>

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
