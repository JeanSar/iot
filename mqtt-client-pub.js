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
const UIDLength = 19;
// Create a port
const port = new SerialPort({
  //path: 'COM6',
  path: '/dev/cu.usbmodem1201',
  baudRate: 115200
},
  function (err) {
    if (err) {
      return console.log('Error: ', err.message)
    }
  }
)
client.on('connect', function () {
  console.log("je publie ");


  //client.end();
})
// Use MQTT broker
var MaUIDValue = ""
// Read data that is available but keep the stream in "paused mode"
port.on('readable', function () {
  //console.log('Data1:', String(port.read()))
  const uidMatch = String(port.read()).trim().match(/UID Value: ([0-9A-F]+)/);

  if (uidMatch != null) {
    const regex = /UID Value:\s*([\dA-Fa-fx ]+)/;
    const match = uidMatch.input.match(regex);
    if (match) {
      MaUIDValue = match[1];
      console.log(MaUIDValue);
      if (MaUIDValue.length === UIDLength) {
        client.publish('test/mytopic', MaUIDValue);
      }
    } else {
      console.log('Pas de valeur UID Value trouvée dans la chaîne.');
    }
  }
})



// // Switches the port into "flowing mode"
port.on('data', function (data) {
  //console.log('Data2:', String(data))
})

// Pipe the data into another stream (like a parser or standard out)
// const lineStream = port.pipe(new Readline())


SerialPort.list().then(ports => {
  const device = ports.reduce((accum, item) => {
    if (item.manufacturer != null && item.manufacturer.indexOf("Arduino") === 0) {
      return item;
    }
    return accum;
  }, null);
  /*
    The following demonstrates using Firmata
    as an IO Plugin for Johnny-Five
   */
  console.log(device.path)
  const board = new five.Board({
    io: new Firmata(device.path)
  });
  board.on("ready", () => {
    const redLed = new five.Led(9);
    redLed.on();
  });


});