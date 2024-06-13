const recoveryUserEmail = document.querySelector("#Recovery-userEmail");
const recoveryVerificationCode = document.querySelector(
  "#Recovery-verificationCode"
);
const recoveryPassword = document.querySelector("#Recovery-password");
var RecoveryEmailCode;
const recoveryURL = "/recoveryMessage";
//发送前检查
async function BeforerecoveryCodeSend(self) {
  if (!recoveryUserEmail.value) {
    showFloatingMessage("邮箱不能为空");
    return false;
  } else if (!MailboxFormat_Check.test(recoveryUserEmail.value)) {
    showFloatingMessage("邮箱格式错误");
    return false;
  } else {
    SendEmail = self;
    Begin_Time();
    RecoveryEmailCode = createCode();
    StartSendEmail(
      recoveryUserEmail.value,
      RecoveryEmailCode,
      "找回",
      EmailsendURL
    );
  }
}
//找回校验
async function CheckRecovery(self) {
  if (
    !recoveryUserEmail.value ||
    !MailboxFormat_Check.test(recoveryUserEmail.value) ||
    !recoveryVerificationCode.value
  ) {
    showFloatingMessage("请先输入标准邮箱并填写邮箱验证码");
    return false;
  } else if (!recoveryPassword.value) {
    showFloatingMessage("密码不能为空");
    return false;
  } else if (recoveryVerificationCode.value != RecoveryEmailCode) {
    showFloatingMessage("验证码错误");
    return false;
  } else {
    self.setAttribute("disabled", "true");
    self.innerHTML = "...申请修改中...";
    const password = recoveryPassword.value;
    const UserEmail = recoveryUserEmail.value;
    try {
      const requestData = {
        useremail: UserEmail,
        password: password,
      };
      const response = await fetch(recoveryURL, {
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

        recoveryUserEmail.value =
          recoveryVerificationCode.value =
          recoveryPassword.value =
            "";
        showFloatingMessage("修改申请成功");
        self.removeAttribute("disabled"); //启用按钮
        self.innerHTML = "立即修改";
        document.querySelector("#Login-userEmail").value = UserEmail;
        ExChangePage(document.querySelector("#login"));
        return true;
      } else {
        console.log("错误码", Data.error);
        showFloatingMessage("错误码:" + Data.error + "\n" + Data.errorMessage);
        RecoveryEmailCode = null;
        self.removeAttribute("disabled"); //启用按钮
        self.innerHTML = "立即修改";
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
