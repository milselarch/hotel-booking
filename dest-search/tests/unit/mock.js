const fs = require('fs');

const modules_folder = 'src/store/modules';
const modules = {}

fs.readdirSync(modules_folder).forEach(file => {
  if (file === 'index.js') { return; }
  const path = `../../${modules_folder}/${file}`;
  modules[file.replace(/(\.\/|\.js)/g, '')] = require(path).default;
});

module.exports = {
  'modules': modules
}