const URL = "/ChatMessage";
/**
 * 聊天记录获取
 * @returns {JSON} 返回Json形式的聊天记录[数组]
 */
async function ReadChatHistory() {
  try {
    const requestData = {
      mode: 1,
    };
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 指定发送的数据格式为JSON
      },
      body: JSON.stringify(requestData),
    });
    const JSONdata = JSON.stringify(await response.json()); // 将返回的响应数据转换为JSON格式
    const Data = JSON.parse(JSONdata); //解JSON
    if (response.status >= 200 && response.status < 300) {
      return Data;
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
/**
 * 向服务器发送新的聊天信息
 * @param {JSON} NewChat 新加入的聊天数据 
 * @returns 返回服务器响应情况，true为成功响应，false为响应失败
 */
async function SendChat(NewChat) {
  try {
    const requestData = {
      mode: 2,
      NewChat: NewChat,
    };
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 指定发送的数据格式为JSON
      },
      body: JSON.stringify(requestData),
    });
    const JSONdata = JSON.stringify(await response.json()); // 将返回的响应数据转换为JSON格式
    const Data = JSON.parse(JSONdata); //解JSON
    if (response.status >= 200 && response.status < 300) {
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
