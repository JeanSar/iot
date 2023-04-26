// Source : https://github.com/mqttjs/MQTT.js

import * as mqtt from "mqtt"  // import everything inside the mqtt module and give it the namespace "mqtt"
import { SerialPort } from "serialport";
import Firmata from "firmata";

import five from "johnny-five";

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
  let lcd = null;
  board.on("ready", () => {
    lcd = new five.LCD({
      pins: [12, 11, 5, 4, 3, 2],
      rows: 2,
      cols: 16,
    });
    lcd.print("Ca commence ...");
  });

  let client = mqtt.connect('mqtt://192.168.78.97:3306') // create a client
  const topic = 'test/mytopic'

  client.on('connect', function () {
    client.subscribe(topic, function (err) {
      if (!err) {
        console.log('Subscribed to:', topic)
      }
    })
  })

  client.on('message', function (topicR, message) {
    // message is Buffer
    var msg = message.toString()
    console.log(topicR + ': ', msg)
    lcd.clear()
    lcd.print(msg)
  })
});
