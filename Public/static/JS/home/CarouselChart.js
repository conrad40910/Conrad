var index = 0;
//效果
function ChangeImg() {
  index++;
  var a = document.getElementsByClassName("CCimg");
  if (index >= a.length) index = 0;
  for (var i = 0; i < a.length; i++) {
    a[i].style.zIndex = i;
  }
  for (var i = 0; i < a.length; i++) {
    a[i].style.opacity = "0";
    a[i].style.pointerEvents = "none";
  }
  a[index].style.opacity = "1";
  a[index].style.pointerEvents = "all";
}
//设置定时器，每隔两秒切换一张图片
setInterval(ChangeImg, 6000);


