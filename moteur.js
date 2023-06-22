import five from "johnny-five";
import * as mqtt from "mqtt"

const port = "/dev/cu.usbmodem1101"
const topic = 'data/motor'
let client = mqtt.connect('mqtt://192.168.78.97:3306') // create a client
let motorSpeed = 140;
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

board.on('ready', function() {
  console.log("Ready!");
  const motor = new five.Motor({
    pins: {
      pwm: 3,
      dir: 12,
    },
    invertPWM: true
  });

  // allow command line access
  board.repl.inject({
    motor: motor
  });

  // on commence par une vitesse initiale
  motorStart()
  motorForward(motorSpeed)

  // adaptation de la vitesse en fonction du message reçu
  client.on('message',  (topicName, message) => {
    // message is Buffer
    let vitesse = JSON.parse(message.toString()).vitesse
    console.log("Speed receive from " + topicName + ': ', vitesse)
    console.log("isRunning", isRunning)
    console.log("goForward", goForward)
    isRunning = true;
    motorSpeed = vitesse
    if (goForward) {
      console.log("Go forward")
      motorForward(motorSpeed);
    } else {
      console.log("Go REverse")
      motorReverse(motorSpeed);
    }
  })

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
    console.log("Vitesse courante : ", motor.currentSpeed)
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