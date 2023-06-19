import five from "johnny-five";
import * as mqtt from "mqtt"

const port = "/dev/cu.usbmodem1101"
const topic = 'data/motor'
let client = mqtt.connect('mqtt://192.168.78.97:3306') // create a client
let motorSpeed = 0;
let goForward = true;
let isRunning = false;
let a = 10;

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
  //const directionSwitch = new five.Button(4);
  //const onOffSwitch = new five.Button(5);
  const motor = new five.Motor({
    pins: {
      pwm: 3,
      dir: 12
    },
    //invertPWM: true
  });
// POUR TESTER
  // allow command line access
  board.repl.inject({
    motor: motor
  });
/*
  motor.on("start", () => {
    console.log(`start: ${Date.now()}`);
  });

  /!*motor.on("stop", () => {
    //console.log(`automated stop on timer: ${Date.now()}`);
    console.log("HERE Stop");
  });*!/

  motor.on("forward", async () => {
    //console.log(`forward: ${Date.now()}`);

    // demonstrate switching to reverse after 5 seconds
    //while (a > 0) {
      //console.log("Speed courant : ", motor.currentSpeed)
      //await new Promise(r => setTimeout(r, 2000));
      board.wait(0, () => motor.forward(280));
    //}
  });

  // set the motor going forward full speed
  console.log("HERE BEFORE FIN")
  motor.forward(200);
  console.log("HERE FI")*/
// FIN TEST


  // There are two (2) listeners for SPEED MOTOR
  // 1 / From the MQTT
  client.on('message',  (topicName, message) => {
    // message is Buffer
    let vitesse = JSON.parse(message.toString()).vitesse
    console.log("Speed receive from " + topicName + ': ', vitesse)
    console.log("isRunning", isRunning)
    console.log("goForward", goForward)
    isRunning = true;
    motorSpeed = vitesse
    console.log("isRunning", isRunning)
    console.log("goForward", goForward)
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