var mqtt = require('mqtt');
const clientId = "client" + Math.random().toString(36).substring(7);

// Change this to point to your MQTT broker
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
});

client.on('message', function (topic, message) {
    var data = message.toString();

    console.log(data);
});

let nhietdo = 5;
let doam = 30;
let anhsang = 80;
let doamdat = 160;

setInterval(() => {
    client.publish('gui-nhiet-do', nhietdo.toString());
    nhietdo++;
    // console.log(nhietdo);
}, 5000);

setInterval(() => {
    client.publish('gui-do-am', doam.toString());
    doam += 5;
    // console.log(doam);
}, 7000);

setInterval(() => {
    client.publish('gui-anh-sang', anhsang.toString());
    anhsang += 7;
    // console.log(anhsang);
}, 3000);

setInterval(() => {
    client.publish('gui-do-am-dat', doamdat.toString());
    doamdat += 3;
    // console.log(doamdat);
}, 6000);


