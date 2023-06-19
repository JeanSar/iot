// Source : https://github.com/mqttjs/MQTT.js

import * as mqtt from "mqtt"
let client = mqtt.connect('mqtt://192.168.78.97:3306')
const topic = 'data/motor'
import data from './adl_aeroport_lyon.adlvoloperationnelarrivee.json' assert { type: "json" };

client.on('connect', function () {
  client.subscribe(topic, function (err) {
    if (!err) {
      console.log('Subscribed to:', topic)
    }
  })
})

client.on('message', function (topicR, message) {
  // message is Buffer
  console.log(topicR + ': ', JSON.parse(message.toString()))
  console.log(data.values[1].airlines_airline_name);
})