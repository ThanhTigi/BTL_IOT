#include <DHT.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>

#define LED_PIN 22
#define FAN_PIN 23
#define LIGHT_PIN 34
#define DHT_PIN 14
#define DHTTYPE DHT11

// WiFi
const char *ssid = "Hùng";          // Enter your WiFi name
const char *password = "12345678";  // Enter WiFi password

// MQTT Broker
const char *mqtt_broker = "broker.hivemq.com";
const int mqtt_port = 1883;

// Topic
const char *topicIotWeather = "iot/weather";
const char *topicIotLedFan = "iot/ledFan";
const char *topicControlLed = "control/led";
const char *topicControlFan = "control/fan";

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHT_PIN, DHTTYPE);
bool isConnected;


void setup() {

  Serial.begin(115200);  // Set software serial baud to 115200;
  dht.begin();

  // Connecting to a WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to the WiFi network");
  Serial.println("***************");


  // Turn off the LED initially
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // Turn off the FAN initially
  pinMode(FAN_PIN, OUTPUT);
  digitalWrite(FAN_PIN, LOW);



  // Connecting to an MQTT broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);

  while (!client.connected()) {
    String client_id = "esp8266-client-";
    client_id += String(WiFi.macAddress());
    Serial.printf("The client %s connects to the public MQTT broker\n", client_id.c_str());

    if (client.connect(client_id.c_str())) {
      Serial.println("Public EMQX MQTT broker connected");
      // isConnected = true;
    } else {
      Serial.print("Failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }

  // Subscribe topics
  Serial.println("Client subcribe topics...");
  client.subscribe(topicControlLed);
  client.subscribe(topicControlFan);

  /*--------------------------------------------------*/



  // Khởi tạo cảm biến DHT11
  // dht.begin();
}



void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Received topic: ");
  Serial.print(topic);
  Serial.print(" | message: ");

  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];  // Convert byte to string
  }
  Serial.println(message);

  // topic control led
  if (String(topic) == String(topicControlLed)) {
    int ledState = digitalRead(LED_PIN);
    if (ledState == LOW && message == "on") {
      digitalWrite(LED_PIN, HIGH);
    } else if (ledState == HIGH && message == "off") {
      digitalWrite(LED_PIN, LOW);
    }
  }
  // topic control fan
  else if (String(topic) == String(topicControlFan)) {
    int fanState = digitalRead(FAN_PIN);
    if (fanState == LOW && message == "on") {
      digitalWrite(FAN_PIN, HIGH);
    } else if (fanState == HIGH && message == "off") {
      digitalWrite(FAN_PIN, LOW);
    }
  }
  Serial.println("-----------------------");
}



void loop() {
  // Đọc nhiệt độ, độ ẩm, ánh sáng
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  float light = analogRead(LIGHT_PIN);
  // float light = random(100, 1000);
  float dust = random(1, 100);

  if (isnan(temperature) || isnan(humidity)) {
    // Serial.println("--- Weather is nan ---");
    temperature = 30;
    humidity = 60;
    // return;
  }

  // Chuyển dữ liệu sang chuỗi để publish qua json
  String temperature_payload = String(int(temperature));
  String humidity_payload = String(int(humidity));
  String light_payload = String(int(light));
  String dust_payload = String(int(dust));

  // Thêm dữ liệu vào JSON
  StaticJsonDocument<200> weatherJson;
  weatherJson["temperature"] = temperature_payload;
  weatherJson["humidity"] = humidity_payload;
  weatherJson["light"] = light_payload;
  weatherJson["dust"] = dust_payload;

  // Chuyển đổi JSON thành chuỗi và gửi lên MQTT
  char weatherJsonStr[200];
  serializeJson(weatherJson, weatherJsonStr);
  client.publish(topicIotWeather, weatherJsonStr);

  // Debug
  Serial.print("Send topic: ");
  Serial.print(topicIotWeather);
  Serial.print(" , message: ");
  Serial.println(weatherJsonStr);

  // // Lấy trạng thái hiện tại của led, fan
  // int ledState = digitalRead(LED_PIN);
  // int fanState = digitalRead(FAN_PIN);

  // String ledState_payload = (ledState == HIGH) ? "on" : "off";
  // String fanState_payload = (fanState == HIGH) ? "on" : "off";

  // // Thêm dữ liệu vào JSON
  // StaticJsonDocument<200> ledFanJson;
  // ledFanJson["led"] = ledState_payload;
  // ledFanJson["fan"] = fanState_payload;

  // // Chuyển đổi JSON thành chuỗi và gửi lên MQTT
  // char ledFanJsonStr[200];
  // serializeJson(ledFanJson, ledFanJsonStr);
  // client.publish(topicLedFan, ledFanJsonStr);

  // Đảm bảo duy trì kết nối MQTT
  client.loop();
  delay(2000);
}