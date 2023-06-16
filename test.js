import five from "johnny-five";
import { SerialPort } from "serialport";
import Firmata from "firmata";

const port = "/dev/tty.usbmodem1101"

/*SerialPort.list().then(ports => {
  const device = ports.reduce((accum, item) => {
    if (item.path) {
      return item;
    }
    return accum;
  }, null);
  console.log("path: ",device.path)
  const board = new five.Board({
    port: device.path,
    io: new Firmata(device.path)
  });
  console.log("id : ", board.id)
  console.log("ready 1 : ", board.isReady)
  console.log("isConnected : ", board.isConnected)
  board.isReady = true
  board.on("ready", function() {
    console.log("FUCKKKKKKK Ready!");
  });
});*/

let board = new five.Board({
  port: port
});
console.log("id : ", board.id)
console.log("ready 1 : ", board.isReady)
console.log("isConnected : ", board.isConnected)
board.on("ready", () => {
  console.log("FUCKKKKKKK Ready!");
});
