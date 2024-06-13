const RegisterUserEmail = document.querySelector("#Register-userEmail");
const RegisterVerificationCode = document.querySelector(
  "#Register-verificationCode"
);
const RegisterPassword = document.querySelector("#Register-password");
var SendEmail;
var EmailCode;
const count = 60;
const EmailsendURL = "/SendEmail";
const RegisterURL = "/RegisterMessage";
//发送前检查
async function BeforeRegisterCodeSend(self) {
  if (!RegisterUserEmail.value) {
    showFloatingMessage("邮箱不能为空");
    return false;
  } else if (!MailboxFormat_Check.test(RegisterUserEmail.value)) {
    showFloatingMessage("邮箱格式错误");
    return false;
  } else {
    SendEmail = self;
    Begin_Time();
    EmailCode = createCode();
    StartSendEmail(RegisterUserEmail.value, EmailCode, "注册", EmailsendURL);
  }
}
//计时模块
function SetTime() {
  if (curCount == 0) {
    window.clearInterval(InterVal); //停止计时器
    SendEmail.removeAttribute("disabled"); //启用按钮
    SendEmail.innerHTML = "重新发送";
  } else {
    curCount--;
    SendEmail.innerHTML = curCount + "秒再获取";
  }
}
function Begin_Time() {
  // 按钮点击倒计时，限制点击
  curCount = count;
  //设置button效果，开始计时
  SendEmail.setAttribute("disabled", "true");
  SendEmail.innerHTML = curCount + "秒再获取";
  InterVal = window.setInterval(SetTime, 1000); //启动计时器，1秒执行一次
}
//验证码建立
function createCode() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += parseInt(Math.random() * 10);
  }
  return code;
}
//发送邮件
async function StartSendEmail(UserEmail, EmailCode, Tips, URL) {
  try {
    const requestData = {
      useremail: UserEmail,
      code: EmailCode,
      Tips: Tips,
    };
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    const JSONdata = JSON.stringify(await response.json()); // 将返回的响应数据转换为JSON格式
    const Data = JSON.parse(JSONdata); //解JSON
    // 在控制台打印返回的数据
    if (response.status >= 200 && response.status < 300) {
      console.log("YES");
      console.log(Data);
      return true;
    } else {
      console.log("错误码", Data.error);
      showFloatingMessage("错误码:" + Data.error + "\n" + Data.errorMessage);
      return false;
    }
  } catch (error) {
    // 捕获可能出现的错误，并在控制台打印错误信息
    console.error("Error sending data:", error);
  }
  alert("数据传输错误，服务器未及时响应，请联系管理员");
  location.replace("/fall-asleep");
  return false;
}
//注册校验
async function CheckRegister(self) {
  if (
    !RegisterUserEmail.value ||
    !MailboxFormat_Check.test(RegisterUserEmail.value) ||
    !RegisterVerificationCode.value
  ) {
    showFloatingMessage("请先输入标准邮箱并填写邮箱验证码");
    return false;
  } else if (!RegisterPassword.value) {
    showFloatingMessage("密码不能为空");
    return false;
  } else if (RegisterVerificationCode.value != EmailCode) {
    showFloatingMessage("验证码错误");
    return false;
  } else {
    self.setAttribute("disabled", "true");
    self.innerHTML = "正在注册...请稍后";
    const password = RegisterPassword.value;
    const UserEmail = RegisterUserEmail.value;
    try {
      const requestData = {
        useremail: UserEmail,
        password: password,
      };
      const response = await fetch(RegisterURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const JSONdata = JSON.stringify(await response.json()); // 将返回的响应数据转换为JSON格式
      const Data = JSON.parse(JSONdata); //解JSON
      // 在控制台打印返回的数据
      if (response.status >= 200 && response.status < 300) {
        console.log("YES");
        console.log(Data);

        RegisterUserEmail.value =
          RegisterVerificationCode.value =
          RegisterPassword.value =
            "";
        showFloatingMessage("注册成功");
        self.removeAttribute("disabled"); //启用按钮
        self.innerHTML = "立即注册";
        document.querySelector("#Login-userEmail").value = UserEmail;
        ExChangePage(document.querySelector("#login"));
        return true;
      } else {
        console.log("错误码", Data.error);
        showFloatingMessage("错误码:" + Data.error + "\n" + Data.errorMessage);
        EmailCode = null;
        self.removeAttribute("disabled"); //启用按钮
        self.innerHTML = "立即注册";
        return false;
      }
    } catch (error) {
      console.log("发生错误：", error);
    }
    alert("数据传输错误，服务器未及时响应，请联系管理员");
    location.replace("/fall-asleep");
    return false;
  }
}
