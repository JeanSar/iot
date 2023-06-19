const int sensor = A5;  // the piezo is connected to analog pin 0
int sensorReading = 0; 

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(sensor, INPUT);
  Serial.println("Initialize System");
}

void loop() {
  // put your main code here, to run repeatedly:
    sensorReading = analogRead(sensor);
    if(sensorReading > 100) {
      Serial.print(sensorReading);
      Serial.print(";");
    } else {
      Serial.print(sensorReading);
      Serial.print(";");
      Serial.println("ok!");
    }
    delay(100);
}
