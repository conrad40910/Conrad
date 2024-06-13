const { log } = require("console");
const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
/*读取追踪器*/
function ReadTrackerGet(ID) {
  try {
    var UserTracker = path.join(
      process.cwd(),
      "/Data/UserData/" + ID + ".json"
    );
    var Tmp = fs.readFileSync(UserTracker, "utf8");
    if (Tmp) {
      var Tracker = JSON.parse(Tmp);
    } else {
      return "";
    }
    if (Tracker) {
      return Tracker;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}
/*写入新的追踪器*/
function writeTrackerGet(ID, writeText) {
  try {
    var UserTracker = path.join(
      process.cwd(),
      "/Data/UserData/" + ID + ".json"
    );
    var Tmp = fs.readFileSync(UserTracker, "utf8");
    let Tracker;
    if (Tmp) {
      Tracker = JSON.parse(Tmp);
    } else {
      Tracker = [];
      writeText.bookID = 0;
    }
    Tracker.push(writeText);
    fs.writeFileSync(UserTracker, JSON.stringify(Tracker), "utf8");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
/*更改追踪器信息*/
function ChangeTracker(ID, bookID, Change) {
  try {
    var UserTracker = path.join(
      process.cwd(),
      "/Data/UserData/" + ID + ".json"
    );
    var Tmp = fs.readFileSync(UserTracker, "utf8");
    if (!Tmp) {
      return false;
    }
    var Tracker = JSON.parse(Tmp);
    if (parseInt(Tracker[bookID].bookPage) < parseInt(Change)) {
      return false;
    }
    Tracker[bookID].bookReadPage = Change;
    fs.writeFileSync(UserTracker, JSON.stringify(Tracker), "utf8");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
/*删除追踪器*/
async function DeleteTracker(ID, bookID) {
  try {
    var UserTracker = path.join(
      process.cwd(),
      "/Data/UserData/" + ID + ".json"
    );
    var Tmp = fs.readFileSync(UserTracker, "utf8");
    if (!Tmp) {
      return false;
    }
    let Tracker = JSON.parse(Tmp);
    if (Tracker[bookID].bookCover != "/static/img/default.jpg") {
      ImgNameReChange(
        path.join(process.cwd(), "/Public/" + Tracker[bookID].bookCover)
      );
    }
    Tracker.splice(bookID, 1);
    for (var i = 0; i < Tracker.length; i++) {
      Tracker[i].bookID = i;
    }
    fs.writeFileSync(UserTracker, JSON.stringify(Tracker), "utf8");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
/*图片删除*/
async function ImgNameReChange(FilePath) {
  try {
    const Test = fs.readFileSync(FilePath, "utf8");
    if (!Test) {
      console.error("错误，文件不存在");
      return;
    }
    fs.unlinkSync(FilePath);
  } catch (err) {
    console.error("在删除书籍封面时出错: ${FilePath}", err);
    return;
  }
  console.log(`书籍封面删除成功: ${FilePath}`);
}
module.exports = {
  ReadTrackerGet,
  writeTrackerGet,
  DeleteTracker,
  ChangeTracker,
};
