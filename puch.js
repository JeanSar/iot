// Source : https://github.com/mqttjs/MQTT.js

import * as mqtt from "mqtt"  // import everything inside the mqtt module and give it the namespace "mqtt"
let client = mqtt.connect('mqtt://192.168.78.97:3306') // create a client

const ob = {
  "object": "MY IUD VALUE",
  "start": "1686919032",
  "end": "1686919042"
}
client.on('connect', function () {
  client.publish('data/raw', JSON.stringify(ob));
  client.end();
})

