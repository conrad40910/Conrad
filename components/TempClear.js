const fs = require("fs");
const path = require("path");
const UpdataIMGTemp = process.cwd() + "/Public/Data/Tmp";
function Clear() {
  fs.readdir(UpdataIMGTemp, (err, files) => {
    if (err) {
      console.error("读取上传缓存失败", err);
      return;
    }
    files.forEach((file) => {
      let filePath = path.join(UpdataIMGTemp, file);
      let fileDetails = fs.statSync(filePath);
      if (fileDetails.isFile()) {
        fs.unlink(filePath, (removeErr) => {
          if (removeErr) {
            console.error(`删除缓存文件出错: ${filePath}`, removeErr);
          } else {
            console.log(`缓存文件删除成功: ${filePath}`);
          }
        });
      }
    });
  });
}
module.exports = Clear;
