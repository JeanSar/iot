// Source : https://github.com/mqttjs/MQTT.js

import * as mqtt from "mqtt"  // import everything inside the mqtt module and give it the namespace "mqtt"
import { Board, Sensor, Motor, Stepper, LCD, Led } from "johnny-five";
import { SerialPort } from "serialport";
import { Readline } from "@serialport/parser-readline";
import Firmata from "firmata";

let client = mqtt.connect('mqtt://192.168.78.97:3306') // create a client
const topic = 'test/mytopic'

const serialPort = new SerialPort("COM6", { baudRate: 115200 });
const arduino = new Firmata(serialPort);

client.on('connect', function () {
  client.subscribe(topic, function (err) {
    if (!err) {
      console.log('Subscribed to:', topic)
    }
  })
})

client.on('message', function (topicR, message) {
  // message is Buffer
  console.log(topicR + ': ', message.toString())
})

arduino.on("ready", () => {
  const parser = serialPort.pipe(new Readline({ delimiter: "\r\n" }));
  parser.on("data", (data) => {
    board.on("ready", () => {
      const lcd = new LCD({
        rows: 2,
        cols: 16,
      });

      lcd.clear();
      lcd.print("bonjour titi");
    });
  });
});
