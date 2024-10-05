package com.example.iot;

import com.example.iot.sensor.Sensor;
import com.example.iot.sensor.SensorController;
import com.example.iot.sensor.SensorJson;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;

public class MQTTController{

    public static String weatherJson = "";
    private static MqttClient client;
    private static String TOPIC_CONTROL_LED = "control/led";
    private static String TOPIC_CONTROL_FAN = "control/fan";
    private static String TOPIC_CONTROL_AIR = "control/air";
    public static void Init() {
        String broker = "tcp://192.168.249.105:1993"; // Địa chỉ broker MQTT
        String clientId = "JavaClient";
        String weatherTopic = "iot/weather";

        try {
            // Tạo client
            client = new MqttClient(broker, clientId);
            MqttConnectOptions options = new MqttConnectOptions();
            options.setCleanSession(true);
            client.connect(options);
            System.out.println("Connected to MQTT broker.");

            // Đăng ký lắng nghe weatherTopic
            client.subscribe(weatherTopic, (receivedTopic, msg) -> {
                String message = new String(msg.getPayload());
                weatherJson = message;
                SensorController.addSensorData(weatherJson);
            });

        } catch (MqttException e) {
            e.printStackTrace();
        }
    }


    public static void SetLightOn(boolean lightStatus) throws MqttException {
        String payload = lightStatus ? "On" : "Off";
        MqttMessage message = new MqttMessage(payload.getBytes());
        message.setQos(2); // Quality of Service
        client.publish(TOPIC_CONTROL_LED, message);
    }

    public static void SetFanOn(boolean fanStatus) throws MqttException {
        String payload = fanStatus ? "On" : "Off";
        MqttMessage message = new MqttMessage(payload.getBytes());
        message.setQos(2); // Quality of Service
        client.publish(TOPIC_CONTROL_FAN, message);
    }

    public static void SetAirOn(boolean airStatus) throws MqttException {
        String payload = airStatus ? "On" : "Off";
        MqttMessage message = new MqttMessage(payload.getBytes());
        message.setQos(2); // Quality of Service
        client.publish(TOPIC_CONTROL_AIR, message);
    }

}
