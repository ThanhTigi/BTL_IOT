package com.example.iot.sensor;

import com.example.iot.Controller;
import com.example.iot.MQTTController;
import com.example.iot.ledfan.LedFan;
import com.example.iot.ledfan.LedFanController;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class SensorController extends Controller {

    @GetMapping("/sensors")
    public List<Sensor> getAllSensors() throws SQLException {
        List<Sensor> sensors = new ArrayList<>();

        String query = "SELECT * FROM sensor";
        PreparedStatement ps = connection.prepareStatement(query);
        ResultSet rs = ps.executeQuery();
        while (rs.next()) {
            int id = rs.getInt("id");
            String temperature = rs.getString("temperature");
            String humidity = rs.getString("humidity");
            String light = rs.getString("light");
            Timestamp date = rs.getTimestamp("date");
            sensors.add(new Sensor(id, temperature, humidity, light, date));
        }
        ps.close();

        // Đảo ngược danh sách sử dụng Collections.reverse()
        Collections.reverse(sensors);

        return sensors;
    }


    public static void addSensorData(String dataString) throws SQLException, ParseException {
        System.out.println("add sensor data: " + dataString);
        // Tạo JSON parser
        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(dataString);
        // Lấy giá trị từ JSONObject dưới dạng String
        String temperature = (String) jsonObject.get("temperature");
        String humidity = (String) jsonObject.get("humidity");
        String light = (String) jsonObject.get("light");

        // Tạo đối tượng Sensor
        Sensor sensor = new Sensor(0, temperature, humidity, light, Timestamp.valueOf(LocalDateTime.now()));

        String query = "INSERT INTO sensor VALUES(?, ?, ?, ?, ?)";
        PreparedStatement ps = connection.prepareStatement(query);
        ps.setInt(1, sensor.getId());
        ps.setString(2, sensor.getTemperature());
        ps.setString(3, sensor.getHumidity());
        ps.setString(4, sensor.getLight());
        ps.setTimestamp(5, sensor.getDate());
        ps.executeUpdate();
        ps.close();
    }

    @GetMapping("/search-sensor")
    public List<Sensor> getSensor(
            @RequestParam(name = "temperature", required = false) String temperature,
            @RequestParam(name = "humidity", required = false) String humidity,
            @RequestParam(name = "light", required = false) String light,
            Model model
    ) throws SQLException {

        List<Sensor> sensors = new ArrayList<>();

        String query = "SELECT * FROM sensor WHERE 1 = 1";

        if (temperature != "") query += " AND temperature = " + temperature;
        if (humidity != "") query += " AND humidity = " + humidity;
        if (light != "") query += " AND light = " + light;

        PreparedStatement ps = connection.prepareStatement(query);
        ResultSet rs = ps.executeQuery();

        while (rs.next()) {
            int _id = rs.getInt("id");
            String _temperature = rs.getString("temperature");
            String _humidity = rs.getString("humidity");
            String _light = rs.getString("light");
            Timestamp _date = rs.getTimestamp("date");
            sensors.add(new Sensor(_id, _temperature, _humidity, _light, _date));
        }
        ps.close();

//        model.addAttribute("iotList", sensors);
        Collections.reverse(sensors);
        return sensors;
    }

    @GetMapping("/clear-sensor")
    public void clearSensor() throws SQLException {
        System.out.println("Clearing sensor data...");
        String query = "DELETE FROM sensor WHERE 1 = 1";
        PreparedStatement ps = connection.prepareStatement(query);
        ps.executeUpdate();
        ps.close();
    }

    @GetMapping("/get-sensor")
    public String getSensor() throws SQLException, ParseException {
        String weatherJson = MQTTController.weatherJson;
        return weatherJson;
    }




}
