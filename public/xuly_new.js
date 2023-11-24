var temps = [];
let max_temp = 0;
let min_temp = 99999999999999999999999;
var hums = [];
let max_hum = 0;
let min_hum = 99999999999999999999999;
var soils = [];
let max_soil = 0;
let min_soil = 99999999999999999999999;
var dat = [];
var k = 0;
let isLight1Open = false;
let isLight2Open = false;
let isAirOpen = false;
let isPumpOpen = false;

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
  client.subscribe('temp');
  client.subscribe('hum');
  // client.subscribe('lux');
  client.subscribe('soilMoisture');
  client.subscribe('light1-st');
  client.subscribe('light2-st');
  client.subscribe('air-st');
  client.subscribe('pump-st');
  // client.subscribe('send-fringerprint-open');
  // client.subscribe('send-fringerprint-close');
});

client.on('message', function (topic, message) {
  var data = message.toString();

  if (topic === 'temp') {
    handleTempData(data);
  } else if (topic === 'hum') {
    handleHumData(data);
  } else if (topic === 'lux') {
    handleLuxData(data);
  } else if (topic === 'soilMoisture') {
    handleSoilMoistureData(data);
  } else if (topic === 'light1-st') {
    handleLight1Status(data);
  } else if (topic === 'light2-st') {
    handleLight2Status(data);
  } else if (topic === 'air-st') {
    handleAirStatus(data);
  } else if (topic === 'pump-st') {
    handlePumpStatus(data);
  }
  // } else if (topic === 'send-fringerprint-open') {
  //   handleSendFringerPrintOpen();
  // } else if (topic === 'send-fringerprint-close') {
  //   handleSendFringerPrintClose();
  // }
});

function handleTempData(data) {
  if (data > max_temp) {
    max_temp = data;
    $("#max_temp").text(data);
  }
  if (data < min_temp) {
    min_temp = data;
    $("#min_temp").text(data);
  }

  if (temps.length < 10) {
    temps.push(data);
  } else {
    temps.shift();
    temps.push(data);
  }
  document.getElementById('temp').textContent = data;
}

function handleHumData(data) {
  if (data > max_hum) {
    max_hum = data;
    $("#max_hum").text(data);
  }
  if (data < min_hum) {
    min_hum = data;
    $("#min_hum").text(data);
  }

  if (hums.length < 10) {
    hums.push(data);
  } else {
    hums.shift();
    hums.push(data);
  }
  document.getElementById('hum').textContent = data;
}

// function handleLuxData(data) {
//   if (data > max_soil) {
//     max_soil = data;
//     $("#max_soil").text(data);
//   }
//   if (data < min_soil) {
//     min_soil = data;
//     $("#min_soil").text(data);
//   }
//   if (soils.length < 10) {
//     soils.push(data);
//   } else {
//     soils.shift();
//     soils.push(data);
//   }
//   document.getElementById('lux').textContent = data;
//   chart_data();
// }

function handleSoilMoistureData(data) {
  if (data > max_soil) {
    max_soil = data;
    $("#max_soil").text(data);
  }
  if (data < min_soil) {
    min_soil = data;
    $("#min_soil").text(data);
  }
  if (soils.length < 10) {
    soils.push(data);
  } else {
    soils.shift();
    soils.push(data);
  }
  document.getElementById('soil').textContent = data;
  chart_data();
}

function handleLight1Status(data) {
  console.log(data);
  if (data.toString() == '0') {
    isLight1Open = false;
    document.getElementById("light1").innerHTML = '<img id="light1img" src="/img/lightOff.png" alt="" class="machine" />Đèn 1</p>'
  } else if (data.toString() == '1') {
    isLight1Open = true;
    document.getElementById("light1").innerHTML = '<img id="light1img" src="/img/light.png" alt="" class="machine" />Đèn 1</p>'
  }
}

function handleLight2Status(data) {
  console.log(data)
  if (data.toString() == '0') {
    isLight2Open = false;
    document.getElementById("light2").innerHTML = '<img id="light2img" src="/img/lightOff.png" alt="" class="machine" />Đèn 2</p>'
  } else if (data.toString() == '1') {
    isLight2Open = true;
    document.getElementById("light2").innerHTML = '<img id="light2img" src="/img/light.png" alt="" class="machine" />Đèn 2</p>'
  }
}

function handleAirStatus(data) {
  if (data.toString() == '0') {
    isAirOpen = false;
    document.getElementById('air').innerHTML = '<img src="/img/fan1.png" alt="" class="machine" />Điều hòa (OFF)';
    document.getElementById('auto').innerHTML = "";
  } else if (data.toString() == '1') {
    isAirOpen = true;
    document.getElementById('air').innerHTML = '<img src="/img/fan1.png" alt="" class="machine" />Điều hòa (ON)';
    document.getElementById('auto').innerHTML = "<p>Nhiệt độ cao. Điều hòa đang được bật</p>";
  }
}

function handlePumpStatus(data) {
  if (data.toString() == '0') {
    isPumpOpen = false;
    document.getElementById('pump1').innerHTML = '<img src="/img/pumps.png" alt="" class="machine" />Máy bơm (OFF)';
  } else if (data.toString() == '1') {
    isPumpOpen = true;
    document.getElementById('pump1').innerHTML = '<img src="/img/pumps.png" alt="" class="machine" />Máy bơm (ON)';
  }
}

// function handleSendFringerPrintOpen() {
//   $(".door").addClass("doorOpen");
//   $(".door").removeClass("doorClose");
//   $("#notify").html("<p>Mật khẩu đúng</p>");
//   $("#notify-pass").html("<p>Cửa đã được mở</p>");
// }
// function handleSendFringerPrintClose() {
//   $(".door").addClass("doorClose");
//   $(".door").removeClass("doorOpen");
//   $("#notify").html("<p>Mật khẩu đúng</p>");
//   $("#notify-pass").html("<p>Cửa đã được đóng</p>");
// }

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('light1').addEventListener('click', function () {
    try {
      if (isLight1Open) {
        client.publish('light1', '0');
      } else {
        client.publish('light1', '1');
      }
    } catch (error) {
      console.log(error);
    }
  });

  document.getElementById('light2').addEventListener('click', function () {
    try {
      if (isLight2Open) {
        client.publish('light2', '0');
      } else {
        client.publish('light2', '1');
      }
    } catch (error) {
      console.log(error);
    }
  });

  document.getElementById('pump1').addEventListener('click', function () {
    if (isPumpOpen) {
      client.publish('pump', '0');
    } else {
      client.publish('pump', '1');
    }
  });

  document.getElementById('air').addEventListener('click', function () {
    if (isAirOpen) {
      client.publish('air', '0');
    } else {
      client.publish('air', '1');
    }
  });

  document.getElementById('export-data').addEventListener('click', function() {
    fetch('/exportData')
      .then(response => {
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => {
        console.error('Lỗi khi tải file: ', error);
      });
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
