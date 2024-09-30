#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"
#include <ArduinoJson.h>

#define dhtpin 25
#define dhttype DHT11
DHT dht(dhtpin, dhttype);

#define LDR_PIN 32  // Chân ADC để đọc tín hiệu từ LDR

#define FAN_PIN 4   
#define AC_PIN 5    
#define LIGHT_PIN 2   

// Thông tin mạng WiFi
const char* ssid = "TiGii";
const char* password = "12345689";

// MQTT Server
const char *mqtt_broker = "192.168.43.105"; // Phong 192.168.1.244 DT 192.168.43.105
const int mqtt_port = 1993;
const char* mqtt_user = "thanh";  // Username MQTT
const char* mqtt_pass = "678";  // Password MQTT
const char* topicIotWeather = "iot/weather";
const char* mqtt_status_topic = "home/device/status";
const char* TOPIC_CONTROL_LED = "control/led";
const char* TOPIC_CONTROL_FAN = "control/fan";
const char* TOPIC_CONTROL_AIR = "control/air";

WiFiClient espClient;
PubSubClient client(espClient);

// Hàm xử lý lệnh từ MQTT
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("topic: ");
  Serial.print(topic);
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print(" Messenger: " );
  Serial.println(message);
  if (String(topic) == TOPIC_CONTROL_LED) {
    // Điều khiển đèn từ MQTT
    if (message == "On") {
      digitalWrite(LIGHT_PIN, HIGH);  // Bật đèn
      client.publish(mqtt_status_topic, "light_on_success");
    } else if (message == "Off") {
      digitalWrite(LIGHT_PIN, LOW);  // Tắt đèn
      client.publish(mqtt_status_topic, "light_off_success");
    } 
  }
  else if (String(topic) == TOPIC_CONTROL_FAN) {
    // Điều khiển quạt từ MQTT
    if (message == "On") {
      digitalWrite(FAN_PIN, HIGH);  // Bật quạt
      client.publish(mqtt_status_topic, "fan_on_success");
    } else if (message == "Off") {
      digitalWrite(FAN_PIN, LOW);  // Tắt quạt
      client.publish(mqtt_status_topic, "fan_off_success");
    } 
  }
  else if (String(topic) == TOPIC_CONTROL_AIR) {
    // Điều khiển điều hòa từ MQTT
    if (message == "On") {
      digitalWrite(AC_PIN, HIGH);  // Bật điều hòa
      client.publish(mqtt_status_topic, "air_on_success");
    } else if (message == "Off") {
      digitalWrite(AC_PIN, LOW);  // Tắt điều hòa
      client.publish(mqtt_status_topic, "air_ff_success");
    } 
  }
}

void setup() {
  Serial.begin(9600);
  dht.begin();

  // Cấu hình chân xuất ra cho 3 thiết bị
  pinMode(FAN_PIN, OUTPUT);
  pinMode(AC_PIN, OUTPUT);
  pinMode(LIGHT_PIN, OUTPUT);

  // Kết nối WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Dang ket noi den WiFi...");
  }
  Serial.println("Da ket noi WiFi");

  // Kết nối đến MQTT Broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while (!client.connected()) {
    String client_id = "esp32-client-";
    client_id += String(WiFi.macAddress());
    Serial.printf("The client %s connects to the public MQTT broker\n", client_id.c_str());

    if (client.connect(client_id.c_str(),mqtt_user,mqtt_pass)) {
      Serial.println("Public EMQX MQTT broker connected");
      // isConnected = true;
    } else {
      Serial.print("Failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
  client.subscribe(TOPIC_CONTROL_LED);  
      client.subscribe(TOPIC_CONTROL_FAN); 
      client.subscribe(TOPIC_CONTROL_AIR); 
}

unsigned long previousMillis = 0;  // Biến lưu thời gian trước đó
const long interval = 2000;  // Khoảng thời gian giữa các lần gửi dữ liệu (2 giây)

void loop() {
  client.loop();  // Lắng nghe các tin nhắn từ MQTT

  // Lấy thời gian hiện tại
  unsigned long currentMillis = millis();

  // Kiểm tra nếu đã đủ 2 giây kể từ lần gửi dữ liệu trước
  if (currentMillis - previousMillis >= interval) {
    // Cập nhật thời gian của lần gửi dữ liệu mới
    previousMillis = currentMillis;

    // Đọc nhiệt độ, độ ẩm, ánh sáng
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    int sensorValue = analogRead(LDR_PIN);
    float voltage = sensorValue * (3.3 / 4095.0);  // Chuyển đổi giá trị ADC sang điện áp (0 - 3.3V)
    float lux = (2500 / voltage - 500) / 3.3;  // Công thức chuyển đổi gần đúng từ điện áp sang lux
    if (lux > 200000) {
      lux = 200000;
    }
    float light = lux;

    // Chuyển dữ liệu sang chuỗi để publish qua JSON
    String temperature_payload = String(int(temperature));
    String humidity_payload = String(int(humidity));
    String light_payload = String(int(light));

    // Thêm dữ liệu vào JSON
    StaticJsonDocument<200> weatherJson;
    weatherJson["temperature"] = temperature_payload;
    weatherJson["humidity"] = humidity_payload;
    weatherJson["light"] = light_payload;

    // Chuyển đổi JSON thành chuỗi và gửi lên MQTT
    char weatherJsonStr[200];
    serializeJson(weatherJson, weatherJsonStr);
    Serial.println(weatherJsonStr);
    client.publish(topicIotWeather, weatherJsonStr);
  }
  
  // client.loop() sẽ được chạy liên tục để lắng nghe các tin nhắn từ MQTT
}
