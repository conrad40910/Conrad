const express = require("express");
const fs = require("fs");
function login(UserEmail, Password) {
  console.log(UserEmail + "\n" + Password);
  try {
    var UserList = JSON.parse(fs.readFileSync("./Data/UserList.json"));
      for (var i = 0; i < UserList.length; i++) {
          if (UserList[i].email == UserEmail && UserList[i].password==Password) {
              return UserList[i].ID;
        }
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}
module.exports = login;
