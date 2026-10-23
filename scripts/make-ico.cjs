const fs = require('fs');
const path = require('path');
const rawPngToIco = require('png-to-ico');
const pngToIco = rawPngToIco.default || rawPngToIco;

const inputPng = path.join(__dirname, '../public/icon.png');
const outputIco = path.join(__dirname, '../public/icon.ico');

pngToIco(inputPng)
  .then((buf) => {
    fs.writeFileSync(outputIco, buf);
    console.log('Successfully generated compliant Windows icon.ico (' + buf.length + ' bytes)');
  })
  .catch((err) => {
    console.error('Error generating ico:', err);
    process.exit(1);
  });
