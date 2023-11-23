const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const { connection } = require("./config/db");
const app = express();
const port = 5000;
const requestIp = require("request-ip");
const user = require("./routes/user");
const fs = require("fs");
var server = require("http").Server(app);
var io = require("socket.io")(server);

var mqtt = require('mqtt');
const clientId = "client" + Math.random().toString(36).substring(7) + "1";

const host = "ws://0.0.0.0:9001/mqtt";

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
  client.subscribe('sql1');
});

app.use(express.json());
app.engine("handlebars", hbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let temp1, hum1, lux1;

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
  } else if (topic === 'sql1') {
    console.log(data);
    handleSaveData();
  } else if (topic === 'export') {
    handleExportData();
  }
});

const handleGuiNhietDo = (data) => {
  temp1 = data;
}

const handleGuiDoAm = (data) => {
  hum1 = data;
}

const handleGuiAnhSang = (data) => {
  lux1 = data;
}

const handleSaveData = () => {
  console.log('Save data');
  console.log(temp1, hum1, lux1)
  connection.connect(function (err) {
    if (err) throw err;
    var n = new Date();
    var month = n.getMonth() + 1;
    var Date_and_Time =
      n.getFullYear() +
      "-" +
      month +
      "-" +
      n.getDate() +
      " " +
      n.getHours() +
      ":" +
      n.getMinutes() +
      ":" +
      n.getSeconds();
    if (temp1 > 0 && temp1 < 100 && hum1 > 0 && hum1 < 100 && lux1 > 0 && lux1 < 1024) {
      var sql =
        "INSERT INTO data3 (Time, Temperature, Humidity, Light) VALUES ('" +
        Date_and_Time.toString() +
        "', '" +
        temp1 +
        "', '" +
        hum1 +
        "', '" +
        lux1 +
        "')";
      connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table inserted");
        console.log(Date_and_Time + " " + temp1 + " " + hum1 + " " + lux1);
      });
    }
    connection.query(
      "SELECT * FROM data3 order by id desc limit 30",
      function (err, result, fields) {
        if (err) throw err;
        client.publish("table1", "5");
      }
    );
  })
}

const handleExportData = () => {
  connection.connect(function (err) {
    if (err) throw err;
    connection.query(
      "SELECT * FROM data3 order by id desc limit 30",
      function (err, result, fields) {
        if (err) throw err;
        var data =
          "ID" +
          "\t" +
          "Time" +
          "\t" +
          "Temperature" +
          "\t" +
          "Humidity" +
          "\t" +
          "Light" +
          "\n";
        for (var i = 0; i < result.length; i++) {
          data =
            data +
            result[i].ID +
            "\t" +
            result[i].Time +
            "\t" +
            result[i].Temperature +
            "\t" +
            result[i].Humidity +
            "\t" +
            result[i].Light +
            "\n";
        }
        fs.writeFile(`data.xls`, data, (err) => {
          if (err) throw err;
          console.log("File created");
        });
      }
    );
  });
}

var thang = [];

app.get("/", (req, res) => {
  res.render("home");
  let check = 0;
  var clientIp = requestIp.getClientIp(req);
  var lengthIp = clientIp.length;
  var ip = clientIp.slice(7, lengthIp);
  for (var i = 0; i < thang.length; i++) {
    if (ip == thang[i].ipAddress) {
      check = 1;
    }
  }

  if (check == 0 && lengthIp > 6) {
    thang.push({ ipAddress: ip, status: "unblock" });
    var dataIp =
      thang[thang.length - 1].ipAddress +
      " " +
      thang[thang.length - 1].status +
      "\n";
    fs.appendFile(`ip_address_list.txt`, dataIp, (err) => { });
  }
  console.log(thang);

  console.log(ip);
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/control", (req, res) => {
  res.render("user/control");
});

const ipIncorrect = [
  {
    ipAddress: "",
    status: "",
    sl: 3,
  },
];
var dem = [];

var h = 0;
var dataIpCorrect;
var ip1;
var dem1 = 3;
var kt = 0;
app.post("/user", async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    connection.query(
      "SELECT * FROM Register WHERE Account = ? AND Password = ?",
      [username, password],
      function (error, results, fields) {
        if (results.length > 0) {
          res.redirect("/control");
          dem1 = 3;
          for (var i = 0; i < ipIncorrect.length; i++) {
            if (ip1 == ipIncorrect[i].ipAddress) {
              ipIncorrect[i].sl = 3;
            }
          }
        } else {
          console.log("Incorrect Username and/or Password!");
          kt = 1;
          res.redirect("/user");
          let check = 0;

          var clientIp = requestIp.getClientIp(req);
          var lengthIp = clientIp.length;
          ip1 = clientIp.slice(7, lengthIp);
          for (var i = 0; i < ipIncorrect.length; i++) {
            if (ip1 == ipIncorrect[i].ipAddress) {
              if (ipIncorrect[i].sl <= 0) {
                break;
              }
              check = 1;
              dem1 = ipIncorrect[i].sl - 1;
              ipIncorrect[i].sl = ipIncorrect[i].sl - 1;
            }
          }
          if (dem1 > 0) {
            io.on("connection", (socket) => {
              socket.emit("tt", dem1);
            });
          }
          if (check == 0 && lengthIp > 6) {
            ipIncorrect.push({
              ipAddress: ip1,
              status: "block",
              sl: 3,
            });
            dataIpCorrect =
              ipIncorrect[ipIncorrect.length - 1].ipAddress +
              " " +
              ipIncorrect[ipIncorrect.length - 1].status +
              "\n";
          }
          if (dem1 < 0) {
            console.log("in");
            fs.appendFile(`ipIncorrect.txt`, dataIpCorrect, (err) => { });
          }
          console.log(ipIncorrect);
          console.log(dem);
          console.log(ip1);
        }
        res.end();
      }
    );
  } else {
    res.send("Please enter Username and Password!");
    res.end();
  }
});

app.get("/history", (req, res) => {
  res.render("user/history");
});

app.use("/user", user);
server.listen(port, function () {
  console.log("Server listening on port " + port);
});
