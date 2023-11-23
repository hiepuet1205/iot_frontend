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

app.use(express.json());
app.engine("handlebars", hbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//--------------------------------------------------------------
var temp1, hum1, lux1;
io.on("connection", function (socket) {
  console.log("A user connected");
  io.sockets.emit("oo", "thang");
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });

  ///send data

  // socket.on("doam", function (data) {
  //   console.log("do am : " + data);
  //   hum1 = data;
  //   socket.broadcast.emit("gui-do-am", data);
  // });
  // socket.on("nhietdo", function (data) {
  //   console.log("nhiet do : " + data);
  //   temp1 = data;
  //   socket.broadcast.emit("gui-nhiet-do", data);
  //   console.log(typeof data);
  // });
  // socket.on("anhsang", function (data) {
  //   console.log("anhsang : " + data);
  //   lux1 = data;
  //   socket.broadcast.emit("gui-anh-sang", data);
  // });

  //----------------------control device--------------------------

  // socket.on("light1", function (data) {
  //   console.log("msg : " + data);
  //   socket.broadcast.emit("esp_light1", data);
  // });
  // socket.on("oo", function (data) {
  //   console.log("msg : " + "thang");
  //   io.sockets.emit("tt", ip1);
  // });
  // socket.on("light2", function (data) {
  //   console.log("msg : " + data);
  //   socket.broadcast.emit("esp_light2", data);
  // });
  // socket.on("pump1", function (data) {
  //   console.log("msg : " + data);
  //   socket.broadcast.emit("esp_pump", data);
  // });
  // socket.on("air", function (data) {
  //   console.log("msg : " + data);
  //   socket.broadcast.emit("esp_air", data);
  // });
  // socket.on("fringerprint_open", function (data) {
  //   console.log("van tay: " + data);
  //   io.sockets.emit("send-fringerprint-open", data);
  // });
  // socket.on("fringerprint_close", function (data) {
  //   console.log("van tay: " + data);
  //   socket.broadcast.emit("send-fringerprint-close", data);
  // });
  // socket.on("door211", function (data) {
  //   socket.broadcast.emit("door2", data);
  //   console.log("door: " + data);
  // });
  // socket.on("door23", function (data) {
  //   socket.broadcast.emit("door3", data);
  //   console.log("door3: " + data);
  // });
  socket.on("sql1", function (data) {
    console.log(data);

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
    if (
      temp1 > 0 &&
      temp1 < 100 &&
      hum1 > 0 &&
      hum1 < 100 &&
      lux1 > 0 &&
      lux1 < 1024
    ) {
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
    connection.connect(function (err) {
      if (err) throw err;
      connection.query(
        "SELECT max(Temperature) from data3",
        function (err, result, fields) {
          if (err) throw err;

          result.forEach(function (max_temp) {
            var temp2 = Object.values(max_temp);
            // console.log(temp2)
            var temp_max = temp2[0];
            socket.broadcast.emit("max_temp", temp_max);
          });
        }
      );
      connection.query(
        "SELECT MIN(Temperature) FROM data3",
        function (err, result, fields) {
          if (err) throw err;
          result.forEach(function (min_temp) {
            var temp3 = Object.values(min_temp);
            temp_min = temp3[0];
            socket.broadcast.emit("min_temp", temp_min);
          });
        }
      );
      //---------------------------------humidity
      connection.query(
        "SELECT MAX(Humidity) FROM data3",
        function (err, result, fields) {
          if (err) throw err;
          result.forEach(function (max_hum) {
            var hum2 = Object.values(max_hum);
            var hum_max = hum2[0];
            socket.broadcast.emit("max_hum", hum_max);
          });
        }
      );
      connection.query(
        "SELECT MIN(Humidity) FROM data3",
        function (err, result, fields) {
          if (err) throw err;
          result.forEach(function (max_hum) {
            var hum3 = Object.values(max_hum);
            hum_min = hum3[0];
            socket.broadcast.emit("min_hum", hum_min);
          });
        }
      );
      //---------------------------------lux
      connection.query(
        "SELECT MAX(Light) FROM data3",
        function (err, result, fields) {
          if (err) throw err;
          result.forEach(function (max_lux) {
            var lux2 = Object.values(max_lux);
            var lux_max = lux2[0];
            socket.broadcast.emit("max_lux", lux_max);
          });
        }
      );
      connection.query(
        "SELECT MIN(Light) FROM data3",
        function (err, result, fields) {
          if (err) throw err;
          result.forEach(function (max_lux) {
            var lux3 = Object.values(max_lux);
            lux_min = lux3[0];
            socket.broadcast.emit("min_lux", lux_min);
          });
        }
      );
      if (err) throw err;
      connection.query(
        "SELECT * FROM data3 order by id desc limit 30",
        function (err, result, fields) {
          if (err) throw err;
          socket.broadcast.emit("table1", result);
        }
      );
    });
  });
  socket.on("export", function (data) {
    console.log(data);
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
  });
});
///-------------------------------------------------------------------------
//-------------------------------------------------------------------------
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
    fs.appendFile(`ip_address_list.txt`, dataIp, (err) => {});
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
            fs.appendFile(`ipIncorrect.txt`, dataIpCorrect, (err) => {});
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

// su dung routes
app.use("/user", user);
server.listen(port, function () {
  console.log("Server listening on port " + port);
});
