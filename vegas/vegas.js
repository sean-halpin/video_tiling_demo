// 'use strict';
var fs = require("fs");
var exec = require('child_process').exec;

var walk = function (dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else {
            /* Is a file */
            results.push(file);
        }
    });
    return results;
}

let files = walk(__dirname + "/..").filter(f => f.includes("stream") && f.includes("m3u8"));
console.log(files);
console.log(files.length);
let x = 320;
let y = 240;
let streamsPerRow = 2;
let numberOfRows = files.length / streamsPerRow;

let launchString = "gst-launch-1.0 videomixer name=mixer \\"
for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < streamsPerRow; column++) {
        launchString += `\nsink_${(row * streamsPerRow) + column}::xpos=${column * x} sink_${(row * streamsPerRow) + column}::ypos=${row * y}  \\`;
    }
}

// launchString += "\n! queue ! videoconvert ! queue ! videoscale ! queue ! autovideosink \\";
launchString += "\n! queue ! videoconvert ! queue ! videoscale ! queue ! x264enc ! hlssink max-files=5 \\";

for (let index = 0; index < files.length; index++) {
    launchString += `\nfilesrc location=${files[index]} ! hlsdemux ! decodebin ! queue ! mixer. \\`
}
launchString = launchString.substring(0, launchString.length - 1);

console.log(launchString);

exec(launchString,
   function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
          console.log('exec error: ' + error);
      }
   });