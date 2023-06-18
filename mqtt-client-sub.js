// Source : https://github.com/mqttjs/MQTT.js

import * as mqtt from "mqtt"  // import everything inside the mqtt module and give it the namespace "mqtt"
import { SerialPort } from "serialport";
import Firmata from "firmata";

import five from "johnny-five";

import data from './adl_aeroport_lyon.adlvoloperationnelarrivee.json' assert { type: "json" };

SerialPort.list().then(ports => {
  const device = ports.reduce((accum, item) => {
    console.log(item)
    if (item.path) {
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

  console.log(board)
  board.on("ready", () => {
    const lcd = new five.LCD({
      pins: [12, 11, 5, 4, 3, 2],
      rows: 2,
      cols: 16,
    });
    lcd.print("Ca commence ...");
    const servo = new five.Servo({
      pin: 9,
      range: [0, 180],
      center: true
    });
    const greenLed = new five.Led(6);
    greenLed.off();
    const redLed = new five.Led(10);
    redLed.on();
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

      // Je tire une valeur aleatoire entre 0 et la taille du dataset
      let randomIdVol = Math.floor(Math.random() * data.values.length + 1);

      // Je calcule la taille d'un tier des données des vols 
      const tierDataSize = Math.floor(data.values.length / 3);

      lcd.clear()
      lcd.cursor(0, 0).print(msg)
      console.log("Ancienne position : " + servo.position)

      // Je calcule la nouvelle possition du moteur en fonction de la potition du vol dans le dataset. 
      // Les 33% premiers vols corespondent au tapi n°1 a la position 0 etc ...
      let newpos = 0;
      if (values.indexOf(randomIdVol) < tierDataSize) {
        newpos = (servo.position + 0) % (servo.range[1] + 0)
      } else if (values.indexOf(randomIdVol) < 2 * tierDataSize) {
        newpos = (servo.position + 90) % (servo.range[1] + 90)
      } else {
        newpos = (servo.position + 180) % (servo.range[1] + 180)
      }

      console.log("Nouvelle position : " + newpos)
      servo.to(newpos, 1000)
      lcd.cursor(1, 0).print(data.values[randomIdVol].airlines_airline_name)
      redLed.toggle();
      greenLed.toggle();
    })
  });
});
