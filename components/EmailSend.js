const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const fs = require("fs");
const { log } = require("console");
async function EmailCodeSend(UserEmail, Tips, code) {
  const transport = nodemailer.createTransport(
    smtpTransport({
      host: "smtp.163.com", // 服务 由于我用的163邮箱
      port: 465, // smtp端口 默认无需改动
      secure: true,
      auth: {
        user: "shanhehuijuan@163.com", // 用户名
        pass: "WQXOIHLGQVKZGGOO", // SMTP授权码
      },
    })
  );
  const HTML = fs.readFileSync(__dirname + "/Verify.html", "utf8");
  const ReHTML = HTML.replace("{%CheckCode%}", code).replace(
    "{%SendMessage%}",
    Tips
  );
  // console.log(UserEmail);
  // console.log(ReHTML);
  var mailOption = {
    from: "shanhehuijuan@163.com", //发件人
    to: UserEmail, //收件人
    subject: "山河绘卷" + Tips + "验证", //标题
    html: ReHTML, //正文，可使用 HTML 格式进行渲染
  };
  transport.sendMail(mailOption, (err, res) => {
    if (err) {
      console.log(err);
      transport.close();
      return false;
    } else if (res.accepted[0] != UserEmail) {
      transport.close();
      return false;
    } else {
      transport.close();
      return true;
    }
  });
}
async function Emailfeedback(UserEmail, Tips) {
  Tips
  const transport = nodemailer.createTransport(
    smtpTransport({
      host: "smtp.163.com", // 服务 由于我用的163邮箱
      port: 465, // smtp端口 默认无需改动
      secure: true,
      auth: {
        user: "shanhehuijuan@163.com", // 用户名
        pass: "WQXOIHLGQVKZGGOO", // SMTP授权码
      },
    })
  );
  // console.log(UserEmail);
  // console.log(ReHTML);
  var mailOption = {
    from: "shanhehuijuan@163.com", //发件人
    to: "shanhehuijuan@163.com", //收件人
    subject: "山河绘卷用户反馈", //标题
    html: "用户邮箱：" + UserEmail + "<br>" + "反馈内容：" + Tips, //正文，可使用 HTML 格式进行渲染
  };
  transport.sendMail(mailOption, (err, res) => {
    if (err) {
      console.log(err);
      transport.close();
      return false;
    } else if (res.accepted[0] != UserEmail) {
      transport.close();
      return false;
    } else {
      transport.close();
      return true;
    }
  });
}
module.exports = { EmailCodeSend, Emailfeedback };
