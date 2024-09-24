package com.example.iot.ledfan;


import com.example.iot.Controller;
import com.example.iot.MQTTController;
import org.eclipse.paho.client.mqttv3.MqttException;
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

    @GetMapping("/searchfanlight")
    public List<LedFan> getFanLed(Model model, @RequestParam("startTime") Timestamp startTime, @RequestParam("endTime") Timestamp endTime) {
        List<LedFan> ledFans = new ArrayList<>();

        try {
            String query = "SELECT * FROM ledFan WHERE date BETWEEN ? AND ?";
            PreparedStatement ps = connection.prepareStatement(query);
            ps.setTimestamp(1, startTime);
            ps.setTimestamp(2, endTime);
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


}
