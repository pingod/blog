var fs = require('fs');
var path = require('path');
var exexSync = require('child_process').execSync;

var base = path.join(__dirname, "./src/_posts/");
var travel = function(filePath) {
  fs.readdirSync(filePath).forEach(function(file) {
    var file = path.join(filePath, file);
    if(fs.statSync(file).isDirectory()) {
      travel(file);
    } else {
      deal(file);
    }
  });
};
travel(base);

function deal(file) {
  var content = fs.readFileSync(file).toString();
  var date = /(\d{4})-(\d{2})-(\d{2})/.exec(file);
  var content2 = content.replace(/\(\/blogimgs\/([^\)]+?)\)/g, function ($0, $1) {
    var name = $1.split('/');
    name = name[name.length - 1];
    fs.renameSync('./src' + $0.slice(1, -1), `./src/blogimgs/${date[1]}/${date[2]}/${date[3]}/${name}`);
    return `(/blogimgs/${date[1]}/${date[2]}/${date[3]}/${name})`;
  });
  // if (content !== content2) {
  //   fs.writeFileSync(file, content2);
  // }
}

function mkDirByPathSync(targetDir, {isRelativeToScript = false} = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
      console.log(`Directory ${curDir} created!`);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
      // console.log(`Directory ${curDir} already exists!`);
    }

    return curDir;
  }, initDir);
}