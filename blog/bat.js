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


var err = [];
travel(base);
console.log(err);


function deal(file) {
  var content = fs.readFileSync(file).toString();
  var date = /(\d{4})-(\d{2})-(\d{2})/.exec(file);
  var content2 = content.replace(/<img src="([^"]+?)"/g, function ($0, $1) {
    if ($1.indexOf('//') === -1 || $1 === "//img.alicdn.com/tfs/TB1oyqGa_tYBeNjy1XdXXXXyVXa-300-300.png") return;
    var url = /^http/.test($1) ? $1 : `http:${$1}`;
    var name = url.split('/');
    name = name[name.length - 1];
    if (url.indexOf('sinaimg') > -1 && url.indexOf('.') === -1) {
      name += '.jpg';
    }
    // console.log(`<img src="//img.alicdn.com/tfs/TB1oyqGa_tYBeNjy1XdXXXXyVXa-300-300.png" data-original="/blogimgs/${date[1]}/${date[2]}/${date[3]}/${name}" data-source="${$1}"`);
    mkDirByPathSync(`./src/blogimgs/${date[1]}/${date[2]}/${date[3]}`);
    try {
      exexSync(`wget -O /Users/barretlee/work/blogsys/blog/src/blogimgs/${date[1]}/${date[2]}/${date[3]}/${name} ${url}`);
    } catch(e) {
      err.push(file + ' ' + $1);
    }
    // // 删除错误目录下的文件
    // if (fs.existsSync(`./src/blogimgs/${name}`)) {
    //   fs.unlink(`./src/blogimgs/${name}`);
    // }
    return `<img src="//img.alicdn.com/tfs/TB1oyqGa_tYBeNjy1XdXXXXyVXa-300-300.png" data-original="/blogimgs/${date[1]}/${date[2]}/${date[3]}/${name}" data-source="${$1}"`;
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