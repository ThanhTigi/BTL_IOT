package com.example.iot;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Controller {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/";
    private static final String SCHEMA = "iot";
    private static final String DB_USERNAME = "root";
    private static final String DB_PASSWORD = ""; //M3C*7yrat6hh0CCw

    public static Connection connection;

    public Controller() {
        if (connection == null) {
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                connection = DriverManager.getConnection(DB_URL + SCHEMA, DB_USERNAME, DB_PASSWORD);
                System.out.println("Ket noi thanh cong");
            } catch (ClassNotFoundException | SQLException e) {
                System.out.println("Ket noi that bai");
                e.printStackTrace();
            }
        }
    }

    public static void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
