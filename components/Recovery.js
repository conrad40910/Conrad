const { log } = require("console");
const fs = require("fs");
const path = require("path");
const UserListPath = path.join(process.cwd(), "/Data/UserList.json");
console.log();
function Recovery(email, password) {
  let Check = 0;
  try {
    const USERLIST = fs.readFileSync(UserListPath, "utf8");
    if (!USERLIST) {
      return 1006; //服务器用户列表访问失败
    }
    let UserList = JSON.parse(USERLIST);
    for (let i = 0; i < UserList.length; i++) {
      if (UserList[i].email.toString() == email.toString()) {
        UserList[i].password = password;
        Check++;
        break;
      }
    }
    if (!Check) {
      return 1009;
    }
    fs.writeFileSync(UserListPath, JSON.stringify(UserList), "utf8");
    return 1111;
  } catch (error) {
    console.error("修改密码的过程中出现了问题：", error);
    return 1008;
  }
}
module.exports = Recovery;
