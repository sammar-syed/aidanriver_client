var socket = getSocket();
var user = JSON.parse(localStorage.getItem("user"));

var isButtonTwoCLicked = false;
var isButtonThreeCLicked = false;

var btnOneParent = document.getElementById("speek");
var btnTwoParent = document.getElementById("start-bell");
var btnThreeParent = document.getElementById("end-bell");
var btnFourParent = document.getElementById("end");

if (!user) {
  let uid = getUrlParam("user");
  console.log("url uid=" + uid);
  if (!uid) {
    location.replace("index.html");
  }
  getUserInfoByUserId(
    uid,
    function () {
      updateUserInfo(getUserInfo());
    },
    function () {
      location.replace("index.html");
    }
  );
} else {
  var globalVolume = user.user_volume / 10.0;
}
var api_url = apiServer;
var audio;
function onKickEventHandle() {
  logout(user.userId, function () {
    window.location.replace("index.html");
  });
}
function updateUserInfo(userInfo) {
  if (!userInfo) {
    return;
  }
  $("#s-title").html("รหัสลพ11: " + userInfo.userid);

  joinSession("group-" + userInfo.cid, "teacher-" + userInfo.userid);
}
$(function () {
  updateUserInfo(user);
  $("#end").attr("disabled", true);
  btnFourParent.childNodes[1].style.backgroundColor = "#F46226";

  $("#speek").click(function () {
    console.log("speek!");
    btnOneParent.childNodes[1].style.backgroundColor = "#F46226";
    $("#speek").attr("disabled", true);
    $("#end").attr("disabled", false);
    btnFourParent.childNodes[1].style.backgroundColor = "#FFFFFF";

    speak(true);
  });

  $("#start-bell").click(function () {
    console.log("start-bell!");
    if (isButtonTwoCLicked == false) {
      btnTwoParent.childNodes[1].style.backgroundColor = "#F46226";
      isButtonTwoCLicked = true;
    } else {
      btnTwoParent.childNodes[1].style.backgroundColor = "#FFFFFF";
      isButtonTwoCLicked = false;
    }
    if (isButtonTwoCLicked) {
      dispatchBellCommand(bellStartAudio, "play");
    } else {
      dispatchBellCommand(bellStartAudio, "stop");
    }
  });

  $("#end-bell").click(function () {
    console.log("end-bell!");
    if (isButtonThreeCLicked == false) {
      btnThreeParent.childNodes[1].style.backgroundColor = "#F46226";
      isButtonThreeCLicked = true;
    } else {
      btnThreeParent.childNodes[1].style.backgroundColor = "#FFFFFF";
      isButtonThreeCLicked = false;
    }
    if (isButtonThreeCLicked) {
      dispatchBellCommand(bellEndAudio, "play");
    } else {
      dispatchBellCommand(bellEndAudio, "stop");
    }
  });

  $("#end").click(function () {
    console.log("end!");
    btnFourParent.childNodes[1].style.backgroundColor = "#F46226";

    $("#speek").attr("disabled", false);
    $("#end").attr("disabled", true);
    btnOneParent.childNodes[1].style.backgroundColor = "#FFFFFF";

    speak(false);
  });

  function getSchedules() {
    var u = api_url + "getSchedules/?user_id=" + user.cid;
    $.ajax({
      type: "get",
      url: u,
      success: function (d) {
        if (d.length > 0) {
          $("#audios").html("");
          var src = "https://kurento.11x1.com/tmp_uploads/";
          for (var i = 0; i < d.length; i++) {
            var url = src + d[i].file_name;
            var date = new Date(d[i].play_time);
            var tmpDate = new Date();
            if (
              tmpDate.getFullYear() == date.getFullYear() &&
              tmpDate.getMonth() == date.getMonth() &&
              tmpDate.getDate() == date.getDate() &&
              tmpDate.getHours() == date.getHours() &&
              tmpDate.getMinutes() == date.getMinutes() &&
              (audio == undefined || audio.paused)
            ) {
              $("#speek").click();
              audio = new Audio(url);
              audio.play();
            }
          }
        }
      },
    });
  }
});

const v1 =
  "https://www.youtube.com/embed/oHWmP3EN1v0?autoplay=1&showinfo=0&controls=1&mute=1";
const v2 =
  "https://www.youtube.com/embed/LGKFRo3POAY?autoplay=1&showinfo=0&controls=1&mute=1";
const v3 =
  "https://www.youtube.com/embed/R56obPIwuhs?autoplay=1&showinfo=0&controls=1&mute=1";

const largeToSmall = () => {
  document.getElementById("large").src = small_v;
  document.getElementById("small").src = large_v;
};
const smallToLarge = () => {
  document.getElementById("large").src = small_v;
  document.getElementById("small").src = large_v;
};

const onlyMain = () => {
  document.getElementById("v1").hidden = false;
  document.getElementById("v2").hidden = true;
  document.getElementById("v3").hidden = true;
};

let v2_boolean = false;
let v3_boolean = false;

const secondVideo = () => {
  document.getElementById("v3").hidden = true;

  if (v2_boolean == false) {
    document.getElementById("v2").hidden = false;
    v2_boolean = true;
    return;
  }
  if (v2_boolean == true) {
    document.getElementById("v2").hidden = true;
    v2_boolean = false;
    return;
  }
};
const thirdVideo = () => {
  document.getElementById("v2").hidden = true;

  if (v3_boolean == false) {
    document.getElementById("v3").hidden = false;
    v3_boolean = true;
    return;
  }
  if (v3_boolean == true) {
    document.getElementById("v3").hidden = true;
    v3_boolean = false;
    return;
  }

  // document.getElementById("v2").hidden = true;
  // document.getElementById("v3").hidden = false;
};
