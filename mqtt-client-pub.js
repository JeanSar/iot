// Sources :
// - https://github.com/mqttjs/MQTT.js
// - https://serialport.io/docs/guide-usage

import * as mqtt from "mqtt"  // import everything inside the mqtt module and give it the namespace "mqtt"

import { SerialPort } from 'serialport'
// import { Readline } from 'readline';
import Firmata from "firmata";
import { raw } from "express";
// Create MQTT client
const client = mqtt.connect('mqtt://192.168.78.97:3306'); // create a client
const UIDLength = 19;
const topic = 'data/raw';
const defaultDataFormat = {
  'object': null,
  'start': null,
  'end': null
}
// Create a port
const port = new SerialPort({
  //path: 'COM6',
  path: '/dev/ttyACM0',
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
let rawData = defaultDataFormat;
// Read data that is available but keep the stream in "paused mode"
port.on('readable', function () {
  //console.log('Data1:', String(port.read()))
  if(!rawData.object) {
    const uidMatch = String(port.read()).trim().match(/UID Value: ([0-9A-F]+)/);

    if (uidMatch) {
      const regex = /UID Value:\s*([\dA-Fa-fx ]+)/;
      const match = uidMatch.input.match(regex);
      if (match) {
        //console.log(match[1]);
        if (match[1].length === UIDLength) {
          rawData.object = match[1].toString();
          console.log(rawData);
        }
      } else {
        console.log('Pas de valeur UID Value trouvée dans la chaîne.');
      }
    }
  } else if (!rawData.start) {
    const sensor1DetectingMatch = String(port.read()).trim().match(/Sensor1 detecting object: ([0-9]+)/);
    if(sensor1DetectingMatch) {
      const regex = /Sensor1 detecting object:\s*([0-9]+)/;
      const match = sensor1DetectingMatch.input.match(regex);
      if (match) {
        rawData.start = Date.now();//match[1];
        console.log(rawData);
      }
    }
  } else if (!rawData.end) {
    const sensor2DetectingMatch = String(port.read()).trim().match(/Sensor2 detecting object: ([0-9]+)/);
    if(sensor2DetectingMatch) {
      const regex = /Sensor2 detecting object:\s*([0-9]+)/;
      const match = sensor2DetectingMatch.input.match(regex);
      if (match) {
        rawData.end = Date.now();//match[1];
        console.log(rawData);
      }
    }
  } else {
    // tout les données sont récupérés : on envoie puis on réinitialise les données
    client.publish(topic.toString(), JSON.stringify(rawData));
    rawData.object = null;
    rawData.start = null;
    rawData.end = null;
    console.log(rawData);
  }

})



// // Switches the port into "flowing mode"
port.on('data', function (data) {
  //console.log('Data2:', String(data))
})

// Pipe the data into another stream (like a parser or standard out)
// const lineStream = port.pipe(new Readline())