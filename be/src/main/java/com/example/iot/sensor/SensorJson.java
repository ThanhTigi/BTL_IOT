package com.example.iot.sensor;

public class SensorJson
{
    String temperature;
    String humidity;
    String light;

    public String getHumidity() {
        return humidity;
    }

    public void setHumidity(String humidity) {
        this.humidity = humidity;
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }

    public String getLight() {
        return light;
    }

    public void setLight(String light) {
        this.light = light;
    }
}
