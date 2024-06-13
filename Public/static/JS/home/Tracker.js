var current = 0;
function TrackerAddAction(self) {
  if (!getCookieID()) {
    showFloatingMessage("还未登录喔，登录后再使用吧");
    return;
  }
  if (current == 45) {
    current = 0;
    ExchangeTrackerAddArea(document.querySelector("#TrackerAddArea"), 0);
  } else {
    current = 45;
    ExchangeTrackerAddArea(document.querySelector("#TrackerAddArea"), 1);
  }
  self.style.transform = "rotate(" + current + "deg)";
}
function ExchangeTrackerAddArea(self, mode) {
  if (mode == 1) {
    //mode==1,展开
    self.classList.remove("UnView");
  } else {
    self.classList.add("UnView");
  }
}
