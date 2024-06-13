const { log } = require("console");
const fs = require("fs");
const path = require("path");
const UserBasePath = process.cwd() + "/Data/UserData/";
const UserImgPath = process.cwd() + "/Public/Data/";
const UserListPath = path.join(process.cwd(), "/Data/UserList.json");
console.log();
function Register(email, password) {
  let MaxID = 100000;
  try {
    const USERLIST = fs.readFileSync(UserListPath, "utf8");
    if (!USERLIST) {
      return 1006; //服务器用户列表访问失败
    }
    let UserList = JSON.parse(USERLIST);
    UserList.forEach((element) => {
      if (element.email.toString() == email.toString()) {
        throw new Error(1007);
      }
      if (parseInt(element.ID) > MaxID) {
        MaxID = parseInt(element.ID);
      }
    });
    UserList.push({
      email: email,
      password: password,
      ID: ++MaxID,
    });
    fs.writeFileSync(UserListPath, JSON.stringify(UserList), "utf8");
    fs.writeFileSync(path.join(UserBasePath, MaxID + ".json"), "[]", "utf8");
    fs.mkdirSync(path.join(UserImgPath, MaxID.toString()));
    return 1111;
  } catch (error) {
    if (error.message == 1007) {
      return 1007;
    }
    console.error("注册过程出现问题：", error);
    return 1008;
  }
}
module.exports = Register;
