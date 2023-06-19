import five from "johnny-five";
import * as mqtt from "mqtt"

const port = "/dev/cu.usbmodem11101"
const topic = 'data/motor'
let client = mqtt.connect('mqtt://192.168.78.97:3306') // create a client
let motorSpeed = 20;
let goForward = true;
let isRunning = false;

// Subscribe to topic data/motor to retrieve Speed motor
client.on('connect', function () {
  client.subscribe(topic, function (err) {
    if (!err) {
      console.log('Subscribed to:', topic)
    }
  })
})

// Create the board
let board = new five.Board({
  port: port
});

board.on('ready', function () {
  console.log("Ready!");
  const directionSwitch = new five.Button(4);
  const onOffSwitch = new five.Button(5);
  const motor = new five.Motor([9, 3, 2]);
  const potPin = new five.Sensor({
    pin: 'A0',
    freq: 250
  });

  // allow command line access
  board.repl.inject({
    onOffSwitch: onOffSwitch,
    directionSwitch: directionSwitch,
    potPin: potPin,
    motor: motor
  });

  // Listen for onOffSwitch 'press' event
  // toggle `isRunning` and start/stop motor
  onOffSwitch.on('press', function () {
    console.log("On/Off pressed")
    isRunning = !isRunning;
    if (isRunning) {
      console.log("On/Off motor start")
      motorStart();
    } else {
      console.log("On/Off motor stop")
      motorStop()
    }
  });

  // Listen for directionSwitch 'press' event
  // toggle `goForward`
  // set isRunning to true (as this will start the motor)
  // call motorForward() or motorReverse()
  directionSwitch.on('press', function () {
    console.log("Switch motor press")

    goForward = !goForward;
    if (!isRunning) isRunning = true;

    if (goForward) {
      console.log("Switch motor forward")
      motorForward();
    } else {
      console.log("Switch motor reverse")
      motorReverse();
    }
  });

  // There are two (2) listeners for SPEED MOTOR
  // 1 / From the MQTT
  client.on('message', function (topicName, message) {
    // message is Buffer
    let vitesse = JSON.parse(message.toString()).vitesse
    console.log("Speed receive from " + topicName + ': ', vitesse)

    if (!isRunning) return;
    motorSpeed = vitesse
    if (goForward) {

      motorStart(0.5);

    } else {
      motorReverse(motorSpeed);
    }

  })

  // 2 FROM PIN (Régulateur de vitesse)
  // Listen to 'data' event on the Potentiometer
  // If the motor isn't running - get out
  // As the motor is running, set `motorSpeed`
  // Send the new speed through to a running motor
  potPin.on('data', function () {
    if (!isRunning) return;
    motorSpeed = this.value / 4;

    if (goForward) {
      motorForward(motorSpeed);
    } else {
      motorReverse(motorSpeed);
    }
  });

  /**
   * motorStart
   * Start the motor
   */

  function motorStart() {
    motor.start(motorSpeed);
  }

  /**
   * motorForward
   * Set the direction of the motor
   * Use `speed` if passed in, or default `motorSpeed`
   * @param  {Number} speed
   */

  function motorForward(speed) {
    motorSpeed = speed || motorSpeed;
    motor.forward(motorSpeed);
  }

  /**
   * motorReverse
   * Set the direction of the motor
   * Use `speed` if passed in, or default `motorSpeed`
   * @param  {Number} speed
   */

  function motorReverse(speed) {
    motorSpeed = speed || motorSpeed;
    motor.reverse(motorSpeed);
  }

  /**
   * motorStop
   * Stop the motor
   */

  function motorStop() {
    motor.stop();
  }
});