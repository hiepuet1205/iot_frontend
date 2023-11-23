var nhiet_do = [];
let max_temp = 0;
let min_temp = 99999999999999999999999;
var do_am = [];
let max_hum = 0;
let min_hum = 99999999999999999999999;
var anh_sang = [];
let max_lux = 0;
let min_lux = 99999999999999999999999;
var dat = [];
var k = 0;

const clientId = "client" + Math.random().toString(36).substring(7);

const host = "ws://localhost:9001/mqtt";

const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
};

var client = mqtt.connect(host, options);

client.on('connect', function () {
  client.subscribe('gui-nhiet-do');
  client.subscribe('tt');
  client.subscribe('gui-do-am');
  client.subscribe('gui-anh-sang');
  client.subscribe('gui-do-am-dat');
  client.subscribe('send-fringerprint-open');
  client.subscribe('send-fringerprint-close');
});

client.on('message', function (topic, message) {
  var data = message.toString();

  if (topic === 'gui-nhiet-do') {
    handleGuiNhietDo(data);
  } else if (topic === 'tt') {
    handleTT(data);
  } else if (topic === 'gui-do-am') {
    handleGuiDoAm(data);
  } else if (topic === 'gui-anh-sang') {
    handleGuiAnhSang(data);
  } else if (topic === 'gui-do-am-dat') {
    handleGuiDoAmDat(data);
  } else if (topic === 'send-fringerprint-open') {
    handleSendFringerPrintOpen();
  } else if (topic === 'send-fringerprint-close') {
    handleSendFringerPrintClose();
  }
});

function handleGuiNhietDo(data) {
  console.log(data);
  if (data > max_temp) {
    max_temp = data;
    $("#max_temp").text(data);
  }
  if (data < min_temp) {
    min_temp = data;
    $("#min_temp").text(data);
  }

  if (nhiet_do.length < 10) {
    nhiet_do.push(data);
  } else {
    nhiet_do.shift();
    nhiet_do.push(data);
  }
  document.getElementById('nhietdo').textContent = data;

  if (data > 30) {
    document.getElementById('auto').innerHTML = "<p>Nhiệt độ cao. Điều hòa đang được tự động bật</p>";
  } else {
    document.getElementById('auto').innerHTML = "<p></p>";
  }
}

// function handleTT(data) {
//   console.log(data);

//   if (data > 0 && data < 3) {
//     alert("Xin vui lòng kiểm tra tài khoản/mật khẩu");
//   }

//   if (data == 0) {
//     alert("Bạn đã quá số lần đăng nhập sai. Vui lòng liên hệ gmail: thangc2k53@gmail.com để mở lại thiết bị");
//     document.getElementById('logout').innerHTML = "<p>Liên hệ admin để mở tài khoản</p>";
//   }

//   var text1 = data;
//   document.getElementById('log').textContent = text1;
// }

function handleGuiDoAm(data) {
  if (data > max_hum) {
    max_hum = data;
    $("#max_hum").text(data);
  }
  if (data < min_hum) {
    min_hum = data;
    $("#min_hum").text(data);
  }

  if (do_am.length < 10) {
    do_am.push(data);
  } else {
    do_am.shift();
    do_am.push(data);
  }
  document.getElementById('doam').textContent = data;
}

function handleGuiAnhSang(data) {
  if (data > max_lux) {
    max_lux = data;
    $("#max_lux").text(data);
  }
  if (data < min_lux) {
    min_lux = data;
    $("#min_lux").text(data);
  }
  if (anh_sang.length < 10) {
    anh_sang.push(data);
  } else {
    anh_sang.shift();
    anh_sang.push(data);
  }
  document.getElementById('anhsang').textContent = data;
  chart_data();
}

function handleGuiDoAmDat(data) {
  // if (dat.length < 10) {
  //   dat.push(data);
  // } else {
  //   dat.shift();
  //   dat.push(data);
  // }
  // document.getElementById('doamdat').textContent = data;
}

function handleSendFringerPrintOpen() {
  $(".door").addClass("doorOpen");
  $(".door").removeClass("doorClose");
  $("#notify").html("<p>Mật khẩu đúng</p>");
  $("#notify-pass").html("<p>Cửa đã được mở</p>");
}
function handleSendFringerPrintClose() {
  $(".door").addClass("doorClose");
  $(".door").removeClass("doorOpen");
  $("#notify").html("<p>Mật khẩu đúng</p>");
  $("#notify-pass").html("<p>Cửa đã được đóng</p>");
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('light1').addEventListener('click', function () {
    try {
      client.publish('light1', '1');
    } catch (error) {
      console.log(error);
    }
  });

  document.getElementById('light2').addEventListener('click', function () {
    try {
      client.publish('light2', '1');
    } catch (error) {
      console.log(error);
    }
  });

  document.getElementById('pump1').addEventListener('click', function () {
    client.publish('pump1', '1');
  });

  document.getElementById('air').addEventListener('click', function () {
    client.publish('air', '1');
  });

  document.getElementById('export-data').addEventListener('click', function () {
    client.publish('export', 'data');
  });

  document.getElementById('open-door').addEventListener('click', function () {
    if (psdoor() === "4444") {
      k = k + 1;

      if (k % 2 == 1) {
        document.querySelector(".door").classList.add("doorOpen");
        document.querySelector(".door").classList.remove("doorClose");
        document.getElementById('notify').innerHTML = "<p>Mật khẩu đúng</p>";
        document.getElementById('notify-pass').innerHTML = "<p>Cửa đã được mở</p>";
        client.publish("door211", "door");
      }
      if (k % 2 == 0) {
        document.querySelector(".door").classList.add("doorClose");
        document.querySelector(".door").classList.remove("doorOpen");
        document.getElementById('notify').innerHTML = "<p>Mật khẩu đúng</p>";
        document.getElementById('notify-pass').innerHTML = "<p>Cửa đã được đóng</p>";
        client.publish("door23", "door");
      }
    } else {
      document.getElementById('notify').innerHTML = "<p>Mật khẩu sai. Xin mời nhập lại</p>";
    }
  });
});

function psdoor() {
  var pass1 = document.getElementById("passdoor").value;
  return pass1;
}
