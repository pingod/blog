var fs = require('fs');
var path = require('path');
var exexSync = require('child_process').execSync;

var base = path.join(__dirname, "./src/_posts/");
var exclude = /.git*|node_modules/;
var travel = function(filePath) {
  fs.readdirSync(filePath).forEach(function(file) {
    var file = path.join(filePath, file);
    if(exclude.test(file)) return;
    if(fs.statSync(file).isDirectory()) {
      travel(file);
    } else {
      deal(file);
    }
  });
};
travel(base);

function deal(file) {
  // console.log(file);
  var content = fs.readFileSync(file).toString();
  var date = /(\d{4})-(\d{2})-(\d{2})/.exec(file);
  content.replace(/http:\/\/images.cnitblog.com\/([^\/]+\/)+?([^"]+?)"/g, function ($0, $1, $2, $3) {
    var name = $2.split('/');
    name = name[name.length - 1];
    var url = $0.slice(0, -1);
    console.log('>>>>>', name, url);
    mkDirByPathSync(`./src/blogimgs/${date[1]}/${date[2]}/${date[3]}`);
    exexSync(`wget -O /Users/barretlee/work/blogsys/blog/src/blogimgs/${date[1]}/${date[2]}/${date[3]}/${name} ${url}`);
    // 删除错误目录下的文件
    if (fs.existsSync(`./src/blogimgs/${name}`)) {
      fs.unlink(`./src/blogimgs/${name}`);
    }
    return `/blogimgs/${date[1]}/${date[2]}/${date[3]}/${name}"`;
  });
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