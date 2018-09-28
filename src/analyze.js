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

const { readFile, stat } = require('fs');
const { parallel } = require('async');
const { sync: globSync } = require('glob');

const NONE = 'NONE';
const WINDOWS = 'WINDOWS';
const UNIX = 'UNIX';
const APPLE = 'APPLE';
const MIXED = 'MIXED';

function countCharacters(string, character) {
  let count = 0;
  for (let i = 0; i < string.length; i++) {
    if (string[i] === character) {
      count++;
    }
  }
  return count;
}

function analyzeFile(file, cb) {
  stat(file, (err, stats) => {
    if (err) {
      cb(err);
      return;
    } else if (stats.isDirectory()) {
      cb();
      return;
    }
    readFile(file, 'utf8', (err, data) => {
      if (err) {
        cb(err);
        return;
      }
      let numLineFeeds = countCharacters(data, '\n');
      let numCarriageReturns = countCharacters(data, '\r');
      if (numLineFeeds === 0 && numCarriageReturns === 0) {
        cb(undefined, NONE);
      } else if (numLineFeeds !== 0 && numCarriageReturns === 0) {
        cb(undefined, UNIX);
      } else if (numLineFeeds !== 0 && numCarriageReturns === numLineFeeds) {
        cb(undefined, WINDOWS);
      } else if (numLineFeeds !== 0 && numCarriageReturns !== numLineFeeds) {
        cb(undefined, MIXED);
      } else if (numLineFeeds === 0 && numCarriageReturns !== 0) {
        cb(undefined, APPLE);
      }
    });
  });
}

function analyzeFiles(filePatterns, cb) {
  const fileList = [];
  if (!Array.isArray(filePatterns)) {
    filePatterns = [ filePatterns ];
  }
  for (const filePattern of filePatterns) {
    fileList.push(...globSync(filePattern).filter((file) => file.indexOf('node_modules') === -1));
  }
  const results = {};
  parallel(fileList.map((file) =>
    (done) => analyzeFile(file, (err, type) => {
      if (err) {
        done(err);
      } else {
        results[file] = type;
        done();
      }
    })
  ), (err) => {
    if (err) {
      cb(err);
    } else {
      cb(undefined, results);
    }
  });
}

function run(filePatterns, cb) {
  analyzeFiles(filePatterns, (err, results) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    for (const filename in results) {
      switch (results[filename]) {
        case NONE:
          console.log(`No line endings found in ${filename}`);
          break;
        case UNIX:
          console.log(`Detected UNIX line endings in ${filename}`);
          break;
        case WINDOWS:
          console.log(`Detected Windows line endings in ${filename}`);
          break;
        case MIXED:
          console.log(`Detected mixed UNIX and Windows line endings in ${filename}`);
          break;
        case APPLE:
          console.log(`Detected old school Apple line endings in ${filename}`);
          break;
      }
    }
  });
};

module.exports = {
  run,
  analyzeFile,
  analyzeFiles,
}
