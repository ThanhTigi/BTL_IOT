package com.example.iot.ledfan;


import com.example.iot.Controller;
import com.example.iot.MQTTController;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class LedFanController extends Controller {

    @GetMapping("/fanlights")
    public List<LedFan> getAllLedFans(Model model) {
        List<LedFan> ledFans = new ArrayList<>();

        try {
            String query = "SELECT * FROM ledFan";
            PreparedStatement ps = connection.prepareStatement(query);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("id"); // id
                String name = rs.getString("name"); // thietbi
                String status = rs.getString("status"); // trangthai
                Timestamp date = rs.getTimestamp("date"); // thoigian
                ledFans.add(new LedFan(id, name, status, date));
            }
            ps.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return ledFans;
    }

    // Tìm kiếm thiết bị theo tên
    @GetMapping("/fanlights/search")
    public List<LedFan> searchLedFans(@RequestParam String deviceName) {
        List<LedFan> ledFans = new ArrayList<>();
        try {
            String query = "SELECT * FROM ledFan WHERE name = ?";
            PreparedStatement ps = connection.prepareStatement(query);
            ps.setString(1, deviceName);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");
                String status = rs.getString("status");
                Timestamp date = rs.getTimestamp("date");
                ledFans.add(new LedFan(id, name, status, date));
            }
            ps.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return ledFans;
    }

    public static LedFan addLedFan(LedFan ledFan) throws SQLException {
        ledFan.setDate(Timestamp.valueOf(LocalDateTime.now()));

        try {
            String query = "INSERT INTO ledFan VALUES(?, ?, ?, ?)";
            PreparedStatement ps = connection.prepareStatement(query);
            ps.setInt(1, ledFan.getId());
            ps.setString(2, ledFan.getName());
            ps.setString(3, ledFan.getStatus());
            ps.setTimestamp(4, ledFan.getDate());
            ps.executeUpdate();
            ps.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return ledFan;
    }

    @DeleteMapping("/deleteAll")
    public ResponseEntity<String> deleteAll() {
        try {
            String query = "DELETE FROM ledFan"; // Truy vấn xóa
            PreparedStatement ps = connection.prepareStatement(query);
            ps.executeUpdate();
            ps.close();
            return ResponseEntity.ok("Dữ liệu đã được xóa thành công.");
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xóa dữ liệu.");
        }
    }


    @PostMapping("/set-light-led")
    public boolean setLightLed(@RequestBody Map<String, Boolean> payload) throws MqttException, SQLException {
        boolean lightStatus = payload.get("lightStatus");
        // Pub một tin nhắn MQTT
        MQTTController.SetLightOn(lightStatus);
        LedFan ledFan = new LedFan(0,"Đèn",lightStatus ? "Bật" : "Tắt",Timestamp.valueOf(LocalDateTime.now()));
        LedFanController.addLedFan(ledFan);
        return lightStatus;
    }

    @PostMapping("/set-fan-led")
    public boolean setFanLed(@RequestBody Map<String, Boolean> payload) throws MqttException, SQLException {
        boolean fanStatus = payload.get("fanStatus");
        // Pub một tin nhắn MQTT
        MQTTController.SetFanOn(fanStatus);
        LedFan ledFan = new LedFan(0,"Quạt",fanStatus ? "Bật" : "Tắt",Timestamp.valueOf(LocalDateTime.now()));
        LedFanController.addLedFan(ledFan);
        return fanStatus;
    }

    @PostMapping("/set-air-led")
    public boolean setAirLed(@RequestBody Map<String, Boolean> payload) throws MqttException, SQLException {
        boolean airStatus = payload.get("airStatus");
        // Pub một tin nhắn MQTT
        MQTTController.SetAirOn(airStatus);
        LedFan ledFan = new LedFan(0,"Điều hòa",airStatus ? "Bật" : "Tắt",Timestamp.valueOf(LocalDateTime.now()));
        LedFanController.addLedFan(ledFan);
        return airStatus;
    }

}
