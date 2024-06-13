var ErrorCheck = 0;
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
async function ChangeOpen(Todo, Text) {
  Todo.style.opacity = 0;
  await sleep(500);
  Todo.innerHTML = '<h4><strong style="color: red;">' + Text + "</strong></h4>";
  ErrorCheck = 1;
  Todo.style.opacity = 1;
}
async function ChangeOrin(Todo) {
  if (ErrorCheck == 0) {
    return;
  }
  Todo.style.opacity = 0;
  await sleep(500);
  Todo.innerHTML =
    "<h4><strong>登</strong>创山河，<strong>录</strong>卷万书</h4>";
  ErrorCheck = 0;
  Todo.style.opacity = 1;
}
async function ExChangePage(Todo) {
  document.querySelector("#login").classList = "fromBox";
  document.querySelector("#register").classList = "fromBox";
  document.querySelector("#recovery").classList = "fromBox";
  Todo.classList = "fromBox View";
}
// <h4><strong>登</strong>创山河，<strong>录</strong>卷万书</h4>
// <h4><strong>注</strong>视星河，<strong>册</strong>绘千梦</h4>
// <h4><strong>找</strong>寻古今，<strong>回</strong>溯百年</h4>

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