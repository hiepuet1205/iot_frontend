var mqtt = require('mqtt');
const clientId = "client" + Math.random().toString(36).substring(7);

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

// client.on('message', function (topic, message) {
//     var data = message.toString();

//     console.log(data);
// });

let nhietdo = 0;
let doam = 0;
let anhsang = 0;
let doamdat = 0;

setInterval(() => {
    client.publish('gui-nhiet-do', nhietdo.toString());
    nhietdo++;
    client.publish('gui-do-am', doam.toString());
    doam += 5;
    client.publish('gui-anh-sang', anhsang.toString());
    anhsang += 7;
    client.publish('gui-do-am-dat', doamdat.toString());
    doamdat += 3;
    client.publish('sql1', Math.random().toString());
}, 6000);

// setInterval(() => {
//     client.publish('gui-do-am', doam.toString());
//     doam += 5;
// }, 7000);

// setInterval(() => {
//     client.publish('gui-anh-sang', anhsang.toString());
//     anhsang += 7;
// }, 3000);

// setInterval(() => {
//     client.publish('gui-do-am-dat', doamdat.toString());
//     doamdat += 3;
// }, 6000);


