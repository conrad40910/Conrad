const chatContainer = document.getElementById("chat-container");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const messagesDiv = document.getElementById("messages");
document.querySelector(".SelectArea").addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  if (li.getAttribute("onclick")) {
    const targetId = li.getAttribute("onclick").match(/#\w+/)[0].substring(1);
    const targetElement = document.getElementById(targetId);
    document.querySelectorAll(".container").forEach((container) => {
      container.classList.add("UnView");
    });
    targetElement.classList.remove("UnView");

    // 显示聊天容器
    if (targetElement.id === "reading") {
      chatContainer.style.display = "block";
      chatContainer.style.opacity = 0;
      // 渐入效果
      setTimeout(() => {
        chatContainer.style.opacity = 1;
      }, 200);
      // 立即执行渐入效果
    } else {
      chatContainer.style.display = "none";
    }
  }
});

function ShowMessage(text, sender, timestamp) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;

  const icon = document.createElement("div");
  icon.className = "message-icon";
  icon.textContent = sender == getCookieID() ? "我" : "用户" + sender;

  const time = document.createElement("span");
  time.className = "message-time";
  time.textContent = timestamp;

  icon.appendChild(time);
  messageDiv.appendChild(icon);

  const messageText = document.createElement("div");
  messageText.textContent = text;
  messageDiv.appendChild(messageText);

  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function refreshChat() {
  const Messages = await ReadChatHistory();
  if (Messages == false) {
    alert("————服务器出现问题，请联系管理员————");
    window.location = "/";
    return;
  }
  messagesDiv.innerHTML = "";
  if (Messages != true) {
    Messages.forEach((element) => {
      ShowMessage(element.chatText, element.chatUser, element.chatTime);
    });
  }
}

setInterval("refreshChat()", 1000);

async function ChatSubmit(self) {
  self.setAttribute("disabled", "true");
  const ID = getCookieID();
  if (!ID) {
    showFloatingMessage("——请先前往《书卷计仪》进行登录——");
  } else if (!chatInput.value) {
    showFloatingMessage("输入为空");
  } else if (chatInput.value.length > 90) {
    showFloatingMessage("输入过长");
  } else {
    timer();
    if (
      (await SendChat({
        chatTime: timer(),
        chatUser: ID,
        chatText: chatInput.value,
      })) == false
    ) {
      alert("————服务器出现问题，请联系管理员————");
      window.location = "/";
    }
    chatInput.value = "";
    refreshChat();
  }
  self.removeAttribute("disabled");
}

chatInput.addEventListener("keydown", (e) => {
  //  && event.ctrlKey
  if (event.key === "Enter") {
    ChatSubmit(document.querySelector("#ChatSUB"));
  }
});

function timer() {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var date = d.getDate();
  var hour = d.getHours();
  var minute = d.getMinutes();
  var second = d.getSeconds();

  year = year < 10 ? "0" + year : year;
  month = month < 10 ? "0" + month : month;
  date = date < 10 ? "0" + date : date;
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  var downTime =
    year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  return downTime;
}
