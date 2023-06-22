// Source : https://github.com/mqttjs/MQTT.js

import * as mqtt from "mqtt"  // import everything inside the mqtt module and give it the namespace "mqtt"
import { SerialPort } from "serialport";
import Firmata from "firmata";

import five from "johnny-five";

import data from './adl_aeroport_lyon.adlvoloperationnelarrivee.json' assert { type: "json" };

SerialPort.list().then(ports => {
  /*
    The following demonstrates using Firmata
    as an IO Plugin for Johnny-Five
   */
  const board = new five.Board({
    io: new Firmata('/dev/cu.usbmodem1101')
  });

  board.on("ready", () => {
    console.log("ici");
    const lcd = new five.LCD({
      pins: [12, 11, 5, 4, 3, 2],
      rows: 2,
      cols: 16,
    });
    lcd.clear()
    lcd.cursor(0, 0).print("Ca commence ...")
    const servo = new five.Servo({
      pin: 9,
      range: [0, 180],
      center: true
    });
    servo.to(0, 1000)
    const greenLed = new five.Led(6);
    greenLed.off();
    const redLed = new five.Led(10);
    redLed.on();

    let client = mqtt.connect('mqtt://192.168.78.97:3306') // create a client
    const topic = 'data/aiguillage'

    client.on('connect', function () {
      client.subscribe(topic, function (err) {
        if (!err) {
          console.log('Subscribed to:', topic)
        }
      })
    })

    client.on('message', function (topicR, message) {
      // message is Buffer
      var msg = JSON.parse(message)
      var randomIdVol = msg.randomIdVol
      console.log(topicR + ': ', randomIdVol)

      // Je tire une valeur aleatoire entre 0 et la taille du dataset
      // let randomIdVol = Math.floor(Math.random() * data.values.length + 1);

      // Je calcule la taille d'un tier des données des vols 
      const tierDataSize = Math.floor(data.values.length / 3);

      lcd.clear()
      lcd.cursor(0, 0).print(msg)
      console.log("Ancienne position : " + servo.position)

      // Je calcule la nouvelle possition du moteur en fonction de la potition du vol dans le dataset. 
      // Les 33% premiers vols corespondent au tapi n°1 a la position 0 etc ...
      var newpos = 0;

      if (randomIdVol < tierDataSize) {
        newpos = 0;
      } else if (randomIdVol < 2 * tierDataSize) {
        newpos = 90;
      } else {
        newpos = 180;
      }

      newpos = newpos % (servo.range[1] + newpos);

      console.log("Nouvelle position : " + newpos)
      servo.to(newpos, 1000)
      lcd.clear()
      lcd.cursor(1, 0).print(+ " " + data.values[randomIdVol].airports_origin_name + " " + newpos + "°")
      redLed.toggle();
      greenLed.toggle();
    })
  });
});
