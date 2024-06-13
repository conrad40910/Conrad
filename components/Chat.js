const { log } = require("console");
const fs = require("fs");
const path = require("path");
const ChatPath = path.join(process.cwd(), "/Data/ChatData/ChatHistory.json");
function Read() {
  try {
    const ReadFirst = fs.readFileSync(ChatPath, "utf8");
    if (ReadFirst == "[]") {
      return true;
    }
    return JSON.parse(ReadFirst);
  } catch (err) {
    console.error(err);
    return false;
  }
}
function Write(NewChat) {
  try {
    const ReadFirst = fs.readFileSync(ChatPath, "utf8");
    let Write = JSON.parse(ReadFirst);
    Write.push(NewChat);
    fs.writeFileSync(ChatPath, JSON.stringify(Write), "utf8");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
module.exports = { Read, Write };
