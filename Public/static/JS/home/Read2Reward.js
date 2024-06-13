const TrackerUrl = "/Trackermessage";
let formData = 0;
var IMGName = 0;
var MaxBookID = -1;
var LastOpen;
const BN = document.querySelector("#bookName");
const BA = document.querySelector("#bookAuthor");
const BP = document.querySelector("#bookPage");
const BRP = document.querySelector("#bookReadPage");
const BI = document.querySelector("#bookIntroduce");
const BR = document.querySelector("#bookReward");
const OT = document.querySelector("#OtherText");
/*添加书本（目标）界面初始化*/
function TrackerAddInit(mode) {
  (BN.value = ""),
    (BA.value = ""),
    (BP.value = ""),
    (BRP.value = ""),
    (BI.value = ""),
    (BI.value = ""),
    (BR.value = ""),
    (OT.value = "");
  document.querySelector("#image_preview").innerHTML =
    '<img src="../static/img/MomentsWeShared.jpg" alt="???">';
  document.querySelector("#AddUpLoad_BookCoverName").innerHTML = "选择文件";
  formData = 0;
  if (!mode) {
    ExchangeTrackerAddArea(document.querySelector("#TrackerAddArea"), 0);
    document.querySelector(".TrackerAdd").style.transform = "rotate(0deg)";
  }
}
/*书本（目标）展开控制*/
async function TrackerGoalExChange(ID, mode) {
  const TrackerGoalDetail = document.querySelectorAll(".TrackerGoalDetail");
  console.log(ID);
  TrackerGoalDetail.forEach(function (container) {
    container.classList.add("UnVivewTracker");
    container.classList.remove("UnVivewTrackerTime");
  });
  if (mode) {
    if (LastOpen != TrackerGoalDetail[ID]) {
      TrackerGoalDetail[ID].classList.remove("UnVivewTracker");
      await sleep(1000);
      TrackerGoalDetail[ID].classList.add("UnVivewTrackerTime");
      LastOpen = TrackerGoalDetail[ID];
    } else {
      LastOpen = null;
    }
  } else {
    LastOpen = null;
  }
}
/*上传图片*/
function uploadImg(event) {
  var e = window.event || event;
  var OfFile = e.target.files[0];
  var imgMaxSize = 1024 * 1024 * 4; //4 MB
  const image_preview = document.querySelector("#image_preview");
  image_preview.innerHTML = '<img src="" alt="">';
  console.log(OfFile.name);
  // 限制文件类型
  if (["jpeg", "png", "jpg"].indexOf(OfFile.type.split("/")[1]) < 0) {
    alert("非常抱歉！仅可上传jpeg、png、jpg格式的图片");
    return;
  }
  //限制大小
  if (OfFile.size > imgMaxSize) {
    alert("文件最大为4MB");
    return;
  }
  document.querySelector("#AddUpLoad_BookCoverName").innerHTML = OfFile.name;
  var reader = new FileReader();
  reader.readAsDataURL(OfFile); // 读取文件
  reader.onload = function (Re) {
    image_preview.innerHTML =
      '<img src="' + Re.target.result + '" alt="图片预览"/>';
  };
  formData = new FormData();
  formData.append("File", OfFile);
  IMGName = OfFile.name;
  console.log(IMGName.substring(IMGName.indexOf(".") + 1, IMGName.length));
}
/*从Cookie中获取 ID */
function getCookieID() {
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf("ID") == 0) return c.substring(name.length + 3, c.length);
  }
  return false;
}
/*书卷计仪渲染*/
async function TrackerRender(
  bookCover,
  bookName,
  bookAuthor,
  bookIntroduce,
  bookPage,
  bookReadPage,
  Reward,
  OtherText,
  bookID
) {
  const RewardText =
    bookPage == bookReadPage
      ? "<span>进度已完成，快看看奖励：" + Reward + "</span>"
      : '<span>进度（页）：</span><span onclick="TryToChangeProgress(' +
        bookID +
        ');">' +
        bookReadPage +
        "/" +
        bookPage +
        "</span>";
  const Text =
    '<div class="TrackerGoal"><div class="TrackerGoalSpine" onclick="TrackerGoalExChange(' +
    bookID +
    ',1);"><div class="TrackerGoalSpine_TopSign"><img src="../static/img/icon/Up.svg" alt="" class="TrackerAdd"></div><div class="TrackerGoalSpine_BookName"><h1>' +
    bookName +
    '</h1></div><div class="TrackerGoalSpine_Topbottom"><img src="../static/img/icon/Up.svg" alt="" class="TrackerAdd"></div></div><div class="TrackerGoalDetail UnVivewTracker"><div class="TrackerGoalDetail_BookMessage"><div class="TrackerGoalDetail_BookMessage_img"><img src="' +
    bookCover +
    '" alt=""></div><div class="TrackerGoalDetail_BookMessage_text"><h1>' +
    bookName +
    "</h1><h2>作者：" +
    bookAuthor +
    "</h2><p>" +
    bookIntroduce +
    '</p><div class="TrackerGoalDetail_BookMessage_Progress">' +
    RewardText +
    '</div></div></div><div class="TrackerGoalDetail_Title"><h1>其他补充</h1></div><div class="TrackerGoalDetail_OtherIntroductions"><p>' +
    OtherText +
    '</p><div class="TrackerGoalDetail_Option"><button onclick="DeleteBook(' +
    bookID +
    ',this);">删除书</button></div></div></div></div>';
  document.querySelector(".TrackerList").insertAdjacentHTML("beforeend", Text);
}
/*未登录处理*/
function Unlogin() {
  document.querySelector(".TrackerList").innerHTML =
    '<a href="/fall-asleep"><h5>还未登录喔<br>————此功能需要登录后使用,点击文字或空白区域进入登录页面————<br><br>(Tips:登录后点击侧边栏里的logo即可退出登陆喔！)</h5></a>';
}
/*书卷计仪数据获取*/
async function GetTracker() {
  const ID = getCookieID();
  if (!ID) {
    Unlogin();
    return;
  }
  try {
    // 定义要发送的数据
    const requestData = {
      ID: ID,
      code: 0,
    };
    // 使用fetch函数发送POST请求，并传入请求的URL、请求方法和要发送的数据
    const response = await fetch(TrackerUrl, {
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
      document.querySelector(".TrackerList").innerHTML = "";
      if (Data != "") {
        for (var i = 0; i < Data.length; i++) {
          await TrackerRender(
            Data[i].bookCover,
            Data[i].bookName,
            Data[i].bookAuthor,
            Data[i].bookIntroduce,
            Data[i].bookPage,
            Data[i].bookReadPage,
            Data[i].Reward,
            Data[i].OtherText,
            Data[i].bookID
          );
        }
        if (Data.length > 0)
          MaxBookID = Data[Data.length - 1] ? Data[Data.length - 1].bookID : -1;
        else MaxBookID = -1;
      } else {
        MaxBookID = -1;
      }
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
  location.replace("/");
  return false;
}
/*书卷计仪数据上传*/
async function SendTracker(self) {
  if (parseInt(BP.value) < parseInt(BRP.value)) {
    showFloatingMessage(
      "就算你二刷了这本书，你的当前阅读的页数也不可能大于总页数吧！！！"
    );
    return;
  }
  if (
    BN.value &&
    BA.value &&
    BP.value &&
    BRP.value &&
    BI.value &&
    BR.value &&
    OT.value
  ) {
    self.innerHTML = "...稍安勿躁，正在提交...";
    self.setAttribute("disabled", "true"); //关闭按钮
    const ID = getCookieID();
    var timestamp = Date.parse(new Date());
    console.log(timestamp); // 1622427159000
    var Cover = "";
    if (!formData) Cover = "/static/img/default.jpg";
    else
      Cover =
        "Data/" +
        ID +
        "/" +
        timestamp +
        "." +
        IMGName.substring(IMGName.indexOf(".") + 1, IMGName.length);
    console.log(MaxBookID);
    try {
      // 定义要发送的数据
      const requestData = {
        ID: ID,
        code: 1,
        NewTracker: {
          bookCover: Cover,
          bookName: "《" + BN.value + "》",
          bookAuthor: BA.value,
          bookIntroduce: BI.value,
          bookPage: BP.value,
          bookReadPage: BRP.value,
          Reward: BR.value,
          OtherText: OT.value,
          bookID: ++MaxBookID,
        },
      };
      // 使用fetch函数发送POST请求，并传入请求的URL、请求方法和要发送的数据
      const response = await fetch(TrackerUrl, {
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
        if (Cover != "/static/img/default.jpg") await IMGUpdata();
        self.removeAttribute("disabled"); //启用按钮
        self.innerHTML = "提交";
        TrackerAddInit();
        TrackerAddAction(document.querySelector("#TrackerAddIMG"));
        GetTracker();
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
    return false;
  } else {
    alert("请填完！！！");
    return;
  }
}
/*书卷计仪数据更改*/
async function TryToChangeProgress(ID) {
  const Todo = document.querySelectorAll(
    ".TrackerGoalDetail_BookMessage_Progress"
  )[ID];
  Todo.innerHTML =
    '<input type="number" name="bookPage" id="ChangeNewbookPage" placeholder="请输入你的最新进度（一旦完成就无法修改了喔）"><button onclick="SendChangeProgress(' +
    ID +
    ',this);">确定</button>';
}
/*书卷计仪修改进度*/
async function SendChangeProgress(ID, self) {
  self.setAttribute("disabled", "true"); //关闭按钮
  self.innerHTML = "...正在修改...";
  if (!document.querySelectorAll("#ChangeNewbookPage")[ID].value) {
    showFloatingMessage("喂！你至少填一个零吧！");
    self.removeAttribute("disabled"); //启用按钮
    self.innerHTML = "再来一次";
    return;
  }
  try {
    // 定义要发送的数据
    const requestData = {
      ID: getCookieID(),
      bookID: ID,
      code: 2,
      NewTracker: document.querySelectorAll("#ChangeNewbookPage")[ID].value,
    };
    // 使用fetch函数发送POST请求，并传入请求的URL、请求方法和要发送的数据
    const response = await fetch(TrackerUrl, {
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
      self.removeAttribute("disabled"); //启用按钮
      GetTracker();
      return true;
    } else {
      console.log("错误码", Data.error);
      if (Data.error == 1002) {
        showFloatingMessage(
          "错误码：1002,服务器拒绝写入,你确定你提交的东西没有毛病吗？确定的话就去联系一下管理员"
        );
        self.innerHTML = "我确定";
        self.removeAttribute("disabled"); //启用按钮
        return false;
      }
      showFloatingMessage("错误码:" + Data.error + "\n" + Data.errorMessage);
      self.innerHTML = "确定";
      self.removeAttribute("disabled"); //启用按钮
      return false;
    }
  } catch (error) {
    // 捕获可能出现的错误，并在控制台打印错误信息
    console.error("Error sending data:", error);
  }
  alert("数据传输错误，服务器未及时响应，请联系管理员");
  location.replace("/");
  return false;
}
/*书卷计仪删除此书*/
async function DeleteBook(ID, self) {
  self.setAttribute("disabled", "true"); //关闭按钮
  self.innerHTML = "...正在删除...";
  try {
    // 定义要发送的数据
    const requestData = {
      ID: getCookieID(),
      bookID: ID,
      code: 3,
    };
    // 使用fetch函数发送POST请求，并传入请求的URL、请求方法和要发送的数据
    const response = await fetch(TrackerUrl, {
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
      self.removeAttribute("disabled"); //启用按钮
      GetTracker();
      return true;
    } else {
      console.log("错误码", Data.error);
      showFloatingMessage("错误码:" + Data.error + "\n" + Data.errorMessage);
      self.removeAttribute("disabled"); //启用按钮
      self.innerHTML = "删除书";
      return false;
    }
  } catch (error) {
    // 捕获可能出现的错误，并在控制台打印错误信息
    console.error("Error sending data:", error);
  }
  alert("数据传输错误，服务器未及时响应，请联系管理员");
  location.replace("/");
  return false;
}
async function IMGUpdata() {
  try {
    // 定义要发送的数据
    // 使用fetch函数发送POST请求，并传入请求的URL、请求方法和要发送的数据
    const response = await fetch("/TrackerImgUpload", {
      method: "POST",
      body: formData,
    });
    const JSONdata = JSON.stringify(await response.json()); // 将返回的响应数据转换为JSON格式
    const Data = JSON.parse(JSONdata); //解JSON
    // 在控制台打印返回的数据
    if (response.status >= 200 && response.status < 300) {
      console.log("YES");
      console.log(Data);
      return true;
    } else {
      console.log("NO: " + Data.error);
      alert("图片上传错误\n错误码：" + Data.error + "\n请联系管理员");
      location.replace("/");
      return false;
    }
  } catch (error) {
    console.log("错误码", Data.error);
    showFloatingMessage("错误码:" + Data.error + "\n" + Data.errorMessage);
  }
  return false;
}
