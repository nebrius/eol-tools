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

const { analyzeFiles, types } = require('./analyze');
const { readFile, writeFile } = require('fs');
const { parallel } = require('async');

function convertFile(file, mode, cb) {
  readFile(file, 'utf8', (err, data) => {
    if (err) {
      cb(err);
      return;
    }
    let i = 0;
    if (mode === 'windows') {
      while (i < data.length) {
        if (data[i] === '\n') {
          if (i === 0) {
            data = '\r' + data;
          } else if (data[i - 1] !== '\r') {
            data = data.substring(0, i) + '\r' + data.substring(i);
          }
        }
        i++;
      }
    } else if (mode === 'unix') {
      while (i < data.length) {
        if (data[i] === '\r') {
          if (data[i + 1] !== '\n') {
            data = data.substring(0, i) + '\n' + data.substring(i + 1);
          } else {
            data = data.substring(0, i) + data.substring(i + 1);
          }
        }
        i++;
      }
    }
    writeFile(file, data, 'utf8', cb);
  });
}

function run(mode, filePatterns) {
  analyzeFiles(filePatterns, (err, files) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    const filesToConvert = [];
    for (const file in files) {
      if (files[file] === types.NONE) {
        continue;
      }
      if (files[file] === types.MIXED ||
        (mode === 'windows' && files[file] !== types.WINDOWS) ||
        (mode === 'unix' && files[file] !== types.UNIX)
      ) {
        console.log(`Converting ${file} from ${files[file].toLowerCase()} line endings to ${mode} line endings`);
        filesToConvert.push(file);
      }
    }
    parallel(filesToConvert.map((file) =>
      (done) => convertFile(file, mode, done)
    ), (err) => {
      if (err) {
        console.error(err);
        process.exit(-1);
      } else {
        console.log('done');
      }
    });
  });
}

module.exports = {
  run
};
