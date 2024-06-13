const Title = document.querySelector("#SidebarTitle");
const Option = document.querySelector(".SelectArea");
const Add = document.querySelector(".TrackerAdd");
var OC = 0;
var Tracker = 0;
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
function TS(Todo) {
  Todo.classList = "container";
}
function ExChange(self) {
  document.querySelectorAll(".container").forEach(function (container) {
    container.classList.add("UnView");
  });
  self.classList.remove("UnView");
  if (self == document.querySelector("#Read2Reward")) {
    Tracker = 1;
    GetTracker();
    OptionChange();
  } else {
    Tracker = 0;
  }
}
async function OptionChange() {
  if (Tracker != 0) {
    Title.classList.add("UnOption");
    Title.classList.add("UnSpace");
    if (OC == 0) {
      Add.classList.add("UnOption");
      await sleep(300);
      Add.classList.add("UnSpace");
      Option.classList.remove("UnSpace");
      await sleep(300);
      Option.classList.remove("UnOption");
      OC++;
    } else {
      Option.classList.add("UnOption");
      await sleep(300);
      Option.classList.add("UnSpace");
      Add.classList.remove("UnSpace");
      await sleep(300);
      Add.classList.remove("UnOption");
      OC = 0;
    }
  } else if (OC == 0) {
    Title.classList.add("UnOption");
    await sleep(300);
    Title.classList.add("UnSpace");
    Option.classList.remove("UnSpace");
    await sleep(300);
    Option.classList.remove("UnOption");
    OC++;
  } else {
    Option.classList.add("UnOption");
    await sleep(300);
    Option.classList.add("UnSpace");
    Title.classList.remove("UnSpace");
    await sleep(300);
    Title.classList.remove("UnOption");
    OC = 0;
  }
}
function showFloatingMessage(message) {
  const floatingMessage = document.createElement("div");
  floatingMessage.className = "floating-message";
  floatingMessage.innerText = message;
  document.body.appendChild(floatingMessage);
  setTimeout(() => {
    floatingMessage.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(floatingMessage);
    }, 500);
  }, 3000);
}
// 添加CSS样式
const style = document.createElement("style");
style.innerHTML = `
  .floating-message {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 0, 0, 0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
  }
`;
document.head.appendChild(style);
function clearAllCookie() {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (var i = keys.length; i--; )
      document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString();
  }
}

async function feedback(self) {
  const conn = document.querySelector("#conn");
  const message = document.querySelector("#feedbackMessage");
  const ID = getCookieID();
  self.setAttribute("disabled", "true");
  if (!ID) {
    showFloatingMessage("虽然很感动，但是请先登录~");
  } else if (!message.value) {
    showFloatingMessage("不能反馈空白喔~");
  } else {
    try {
      const requestData = {
        useremail: !conn.value ? "无" : conn.value,
        tips: message.value + "<br>反馈用户ID：" + ID + "<br>反馈时间：" + timer(),
      };
      const response = await fetch("/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // 指定发送的数据格式为JSON
        },
        body: JSON.stringify(requestData),
      });
      const JSONdata = JSON.stringify(await response.json()); // 将返回的响应数据转换为JSON格式
      const Data = JSON.parse(JSONdata); //解JSON
      if (response.status >= 200 && response.status < 300) {
        showFloatingMessage("反馈成功~感谢您的反馈~");
        self.removeAttribute("disabled");
        return true;
      } else {
        console.log("错误码", Data.error);
        showFloatingMessage("错误码:" + Data.error + "\n" + Data.errorMessage);
        console.log("NO: " + Data.error);
        return false;
      }
    } catch (error) {
      // 捕获可能出现的错误，并在控制台打印错误信息
      console.error("Error sending data:", error);
    }
    alert("数据传输错误，服务器未及时响应，请联系管理员");
    location.replace("/");
  }
}
