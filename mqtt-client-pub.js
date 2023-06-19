// Sources :
// - https://github.com/mqttjs/MQTT.js
// - https://serialport.io/docs/guide-usage

import * as mqtt from "mqtt"  // import everything inside the mqtt module and give it the namespace "mqtt"

import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
//import { ReadlineParser } from 'readline';
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
  path: '/dev/ttyACM0',
  baudRate: 115200,
  parser: new ReadlineParser({ delimiter: '\n' })
},
  function (err) {
    if (err) {
      return console.log('Error: ', err.message)
    }
  }
)

client.on('connect', function () {
  console.log("je publie ");

})

//empty data to send
let rawData = defaultDataFormat;
const uidRegex = /UID Value: ([\dA-Fx ]{19})/;
const sensor1Regex = /Sensor1 detecting object:\s*([0-9]+)/;
const sensor2Regex = /Sensor2 detecting object:\s*([0-9]+)/;

port.on('data', function (data) {
  const dataStr = data.toString()
  //console.log(dataStr);
  if (!rawData.object) {
    const uidMatch = dataStr.trim().match(uidRegex);
    if (uidMatch) {
      rawData.object = uidMatch[1];
      console.log(rawData);
    }
  }
  else if (!rawData.start) {
    const sensor1Match = dataStr.trim().match(sensor1Regex);
    if (sensor1Match) {
      rawData.start = sensor1Match[1];
      console.log(rawData);
    }
  }
  else if (!rawData.end) {
    const sensor2Match = dataStr.trim().match(sensor2Regex);
    if (sensor2Match) {
      if (sensor2Match[1] > rawData.start) {
        rawData.end = sensor2Match[1];
        // tout les données sont récupérés : on envoie puis on réinitialise les données
        console.log(rawData);
        client.publish(topic.toString(), JSON.stringify(rawData));
        console.log("Data send")
        rawData.object = null;
        rawData.start = null;
        rawData.end = null;
      } else {
        console.log("Le timestamp de Sensor2 est inférieur ou égale à Sensor1")
      }
    }
  }
})
