import * as mqtt from "mqtt";
import { Board, Sensor, Motor, Stepper, LCD, Led } from "johnny-five";
import { SerialPort } from "serialport";
import { Readline } from "@serialport/parser-readline";
import Firmata from "firmata";

const client = mqtt.connect("mqtt://192.168.78.97:3306");
const topic = "test/mytopic";

const board = new Board();
const serialPort = new SerialPort("COM6", { baudRate: 115200 });
const arduino = new Firmata(serialPort);

const motor = new Stepper({
  type: Stepper.TYPE.DRIVER,
  stepsPerRev: 200,
  pins: {
    step: 2,
    dir: 3,
  },
});

const lcd = new LCD({
  controller: "PCF8574AT",
});

const bagageDetectionSensor = new Sensor({
  pin: "A0",
  freq: 100,
});

client.on("connect", function () {
  client.subscribe(topic, function (err) {
    if (!err) {
      console.log("Subscribed to:", topic);
    }
  });
});

client.on("message", function (topicR, message) {
  // message is Buffer
  console.log(topicR + ": ", message.toString());
});

arduino.on("ready", () => {
  const parser = serialPort.pipe(new Readline({ delimiter: "\r\n" }));
  parser.on("data", (data) => {
    const redLed = new Led(13);
    const greenLed = new Led(12);

    // Associer les positions nominales du moteur à des airportresources_baggagedelivery_baggagebelts
    if (data === "airportresources_baggagedelivery_baggagebelts_1") {
      motor.step({ steps: 200, direction: Stepper.DIRECTION.CCW });
      lcd.clear().print("Arrivée vol AF123");
    } else if (data === "airportresources_baggagedelivery_baggagebelts_2") {
      motor.step({ steps: 200, direction: Stepper.DIRECTION.CW });
      lcd.clear().print("Arrivée vol BA456");
    }

    // Associer aléatoirement un numéro de bagage à l'un des vols
    const bagage = Math.floor(Math.random() * 1000) + 1;
    console.log(`Bagage ${bagage} aiguillé vers ${data}`);

    redLed.on();
    greenLed.off();
  });
});

board.on("ready", () => {
  const ledGreen = new Led(12);
  const ledRed = new Led(13);
  const sensor = new Sensor("A0");
  const motor = new Motor({ pins: { step: 2, dir: 3 } });
  const lcd = new LCD({
    controller: "PCF8574AT",
    rows: 2,
    cols: 16,
  });

  lcd.clear();
  lcd.print("Aiguillage prêt");

  sensor.on("change", () => {
    if (sensor.value > 100) {
      ledGreen.on();
      ledRed.off();
      lcd.clear();
      lcd.print("Vers point 1");
      motor.ccw();
      board.wait(2000, () => {
        motor.stop();
        lcd.clear();
        lcd.print("Aiguillage prêt");
      });
    } else {
      ledGreen.off();
      ledRed.on();
    }
  });
});
