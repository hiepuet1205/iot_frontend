var nhiet_do = [];
var do_am = [];
var anh_sang = [];
var dat = [];
var socket = io("http://192.168.1.133:5000");
var kt1 = 0;
socket.on("gui-nhiet-do", function (data) {
  if (nhiet_do.length < 10) {
    nhiet_do.push(data);
  } else {
    nhiet_do.shift();
    nhiet_do.push(data);
  }
  $("#nhietdo").text(data);
  if (data > 30) {
    $("#auto").html("<p>Nhiệt độ cao. Điều hòa đang được tự đông bật</p>");
  } else {
    $("#auto").html("<p></p>");
  }
});

socket.on("tt", function (data) {
  console.log(data);

  if (data > 0 && data < 3) {
    alert("Xin vui lòng kiểm tra tài khoản/mật khẩu");
  }

  if (data == 0) {
    alert(
      "Bạn đã quá số lần đăng nhập sai. Vui lòng liên hệ gmail: thangc2k53@gmail.com để mở lại thiết bị"
    );
    $("#logout").html("<p>Liên hệ admin để mở tài khoản</p>");
  }
  var text1 = data;
  $("#log").text(text1);
});

socket.on("gui-do-am", function (data) {
  if (do_am.length < 10) {
    do_am.push(data);
  } else {
    do_am.shift();
    do_am.push(data);
  }
  $("#doam").text(data);
});

socket.on("gui-anh-sang", function (data) {
  if (anh_sang.length < 10) {
    anh_sang.push(data);
  } else {
    anh_sang.shift();
    anh_sang.push(data);
  }
  $("#anhsang").text(data);
  chart_data();
});
socket.on("gui-do-am-dat", function (data) {
  if (dat.length < 10) {
    dat.push(data);
  } else {
    dat.shift();
    nhiet_do.push(data);
  }
  $("#doamdat").text(data);
});
socket.on("gui-muc-nuoc", function (data) {
  $("#muc-nuoc").text(data);
});
socket.on("max_temp", function (data) {
  $("#max_temp").text(data);
});
socket.on("min_temp", function (data) {
  $("#min_temp").text(data);
});
socket.on("max_hum", function (data) {
  $("#max_hum").text(data);
});
socket.on("min_hum", function (data) {
  $("#min_hum").text(data);
});
socket.on("max_lux", function (data) {
  $("#max_lux").text(data);
});
socket.on("min_lux", function (data) {
  $("#min_lux").text(data);
});

socket.on("tt", function (data) {
  $("#log").text(data);
  console.log(data);
});

socket.on("send-fringerprint-open", function (data) {
  $(".door").addClass("doorOpen");
  $(".door").removeClass("doorClose");
  $("#notify").html("<p>Mật khẩu đúng</p>");
  $("#notify-pass").html("<p>Cửa đã được mở</p>");
});
socket.on("send-fringerprint-close", function (data) {
  $(".door").addClass("doorClose");
  $(".door").removeClass("doorOpen");
  $("#notify").html("<p>Mật khẩu đúng</p>");
  $("#notify-pass").html("<p>Cửa đã được đóng</p>");
});
///---------------------------------
socket.on("table1", function (data) {
  console.log(data);
  $("#id-content").html("");
  $("#time-content").html("");
  $("#temp-content").html("");
  $("#hum-content").html("");
  $("#lux-content").html("");
  data.forEach(function (item) {
    $("#id-content").append("<div class='h-para'>" + item.ID + "</div>");
    $("#time-content").append("<div class='h-para'>" + item.Time + "</div>");
    $("#temp-content").append(
      "<div class='h-para'>" + item.Temperature + "</div>"
    );
    $("#hum-content").append("<div class='h-para'>" + item.Humidity + "</div>");
    $("#lux-content").append("<div class='h-para'>" + item.Light + "</div>");
  });
});
var k = 0;
//---------------------------------------
$(document).ready(function () {
  $("#light1").click(function () {
    socket.emit("light1", "light1");
  });
  $("#light2").click(function () {
    socket.emit("light2", "light2");
  });
  $("#pump1").click(function () {
    socket.emit("pump1", "pump1");
  });
  $("#air").click(function () {
    socket.emit("air", "air");
  });

  $("#export-data").click(function () {
    socket.emit("export", "data");
  });

  $("#open-door").click(function () {
    if (psdoor() == "4444") {
      k = k + 1;

      if (k % 2 == 1) {
        $(".door").addClass("doorOpen");
        $(".door").removeClass("doorClose");
        $("#notify").html("<p>Mật khẩu đúng</p>");
        $("#notify-pass").html("<p>Cửa đã được mở</p>");
        socket.emit("door211", "door");
      }
      if (k % 2 == 0) {
        $(".door").addClass("doorClose");
        $(".door").removeClass("doorOpen");
        $("#notify").html("<p>Mật khẩu đúng</p>");
        $("#notify-pass").html("<p>Cửa đã được đóng</p>");
        socket.emit("door23", "door");
        // socket.emit("oo", "door");
      }
    } else {
      $("#notify").html("<p>Mật khẩu sai. Xin mời nhập lại</p>");
    }
  });
});
// mật khẩu cửa
function psdoor() {
  var pass1 = document.getElementById("passdoor").value;
  return pass1;
}
