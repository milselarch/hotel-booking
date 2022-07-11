const fs = require('fs');

const modules_folder = 'src/store/modules';
fs.readdirSync(modules_folder).forEach(file => {
  console.log(file);
});

