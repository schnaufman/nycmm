'use strict';

const lqip = require('lqip');
const glob = require('glob');
const gm = require('gm');

const imagePath = __dirname + '/../assets/img/';
console.log(imagePath);

console.log('Creating lqip for all images in: ' + imagePath);

var getPics = function (src, callback) {
  glob(src + '**/*.{jpg,jpeg,png}', callback);
};

getPics(imagePath, function (err, result) {
  if (err) {
    console.error(err);
    return;
  }

  result.forEach(file => {
    lqip.base64(file).then(res => {
      console.log('\n---------------------------------------------');
      console.log('Creating lquid for ' + file + '\n');
      console.log('lqip: "' + res + '"'); // "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhY.....
      console.log('---------------------------------------------\n');
    });

    // obtain the size of an image
    gm(file)
      .size(function (err, size) {
        if (err) {
          console.error(err);
          return;
        }
        console.log('\n---------------------------------------------');
        console.log('Size for ' + file + '\n');
        console.log('width: "' + size.width + 'px"');
        console.log('height: "' + size.height + 'px"');
        console.log('---------------------------------------------\n');
      });
  });
});

