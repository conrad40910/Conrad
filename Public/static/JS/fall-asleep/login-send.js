const LoginUserEmail = document.querySelector("#Login-userEmail");
const LoginUserPassword = document.querySelector("#Login-userPassword");
const LoginTitle = document.querySelector("#ErrorMessageLogin");
const Request_url = "/login"; //发送请求的 URL
const MailboxFormat_Check = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
/****/
var check = 0;

async function Before_SendLogin(self) {
  if (!LoginUserEmail.value) {
    showFloatingMessage("邮箱为空");
  } else if (!MailboxFormat_Check.test(LoginUserEmail.value)) {
    showFloatingMessage("邮箱格式错误");
  } else if (!LoginUserPassword.value) {
    showFloatingMessage("密码为空");
  } else {
    self.value = "稍安勿躁，正在为你登录......";
    self.setAttribute("disabled", "true"); //关闭按钮
    SendLogin(LoginUserEmail.value, LoginUserPassword.value).then(() => {
      self.removeAttribute("disabled"); //启用按钮
      if (check === 1) {
        console.log("登录成功");
        // document.querySelector('#form1').submit();
        location.replace("/");
        return true;
      } else {
        self.value = "重新登录";
        return false;
      }
    });
    return false;
  }
}
async function SendLogin(Email, Password) {
  try {
    // 定义要发送的数据
    const requestData = {
      email: Email,
      password: Password,
    };
    // 使用fetch函数发送POST请求，并传入请求的URL、请求方法和要发送的数据
    const response = await fetch(Request_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 指定发送的数据格式为JSON
      },
      body: JSON.stringify(requestData), // 将数据转换为JSON格式并发送
    });
    const JSONdata = JSON.stringify(await response.json()); // 将返回的响应数据转换为JSON格式
    const Data = JSON.parse(JSONdata); //解JSON
    // 在控制台打印返回的数据
    if (response.status >= 200 && response.status < 300) {
      console.log("YES");
      console.log(Data);
      check = 1;
      return true;
    } else {
      check = Data.error;
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