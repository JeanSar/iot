// Source : https://github.com/mqttjs/MQTT.js

import * as mqtt from "mqtt"  // import everything inside the mqtt module and give it the namespace "mqtt"
let client = mqtt.connect('mqtt://192.168.78.97:3306') // create a client

const ob = {
  "object": "0xF3 0x8D 0x44 0x53",
  "start": "5038",
  "end": "6798"
}
client.on('connect', function () {
  client.publish('data/raw', JSON.stringify(ob));
  client.end();
})


// const jsonString = JSON.stringify(msg.payload);

// const objectStartIndex = jsonString.indexOf("\"object\":\"") + 10;
// const objectEndIndex = jsonString.indexOf("\",\"", objectStartIndex);
// // const objectValue = jsonString.substring(objectStartIndex, objectEndIndex);

// const startStartIndex = jsonString.indexOf("\"start\":\"") + 9;
// const startEndIndex = jsonString.indexOf("\",\"", startStartIndex);
// // const startValue = Number(jsonString.substring(startStartIndex, startEndIndex));

// const endStartIndex = jsonString.indexOf("\"end\":\"") + 7;
// const endEndIndex = jsonString.indexOf("\"}", endStartIndex);
// // const endValue = Number(jsonString.substring(endStartIndex, endEndIndex));


// // Extraire la valeur de "object"
// const objectValue = jsonString.substring(
//   jsonString.indexOf("\"object\":\"") + 10,
//   jsonString.indexOf("\",\"start\"")
// );

// // Extraire la valeur de "start"
// const startValue = parseInt(jsonString.match(/\"start\":(\d+)/)[1]);

// // Extraire la valeur de "end"
// const endValue = parseInt(jsonString.match(/\"end\":(\d+)/)[1]);
