// Sources :
// - https://github.com/mqttjs/MQTT.js
// - https://serialport.io/docs/guide-usage

import * as mqtt from "mqtt"  // import everything inside the mqtt module and give it the namespace "mqtt"

import { SerialPort } from 'serialport'
// import { Readline } from 'readline';
import five from "johnny-five";
import Firmata from "firmata";
// Create MQTT client
const client = mqtt.connect('mqtt://192.168.78.97:3306') // create a client
client.on('connect', function () {
  console.log("je publie ");
  //client.end();
})

const sensorFreq = 300
const sensorThreshold = 100

const board = new five.Board({
  io: new Firmata('/dev/ttyACM0')
});
//http://johnny-five.io/api/sensor/
board.on("ready", () => {
  console.log("Board is ready")
  const sensor1 = new five.Sensor({
    pin: "A5",
    freq: sensorFreq,
    threshold: sensorThreshold
  });
  sensor1.on("change", function () {
    console.log("Sensor 1 : " + this.scaleTo(0, 100));
  });
  // sensor1.within([ 300, 1023 ], function() {
  //   console.log("OBJECT on sensor 1 : " + sensor1.value);
  // });

  const sensor2 = new five.Sensor({
    pin: "A4",
    freq: sensorFreq,
    threshold: sensorThreshold
  });
  sensor2.on("change", function () {
    console.log("Sensor 2 : " + this.scaleTo(0, 100));
  });
  // sensor2.within([ 300, 1023 ], function() {
  //   console.log("OBJECT on sensor 2 : " + sensor2.value);
  // });
});
