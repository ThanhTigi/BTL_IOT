import { useState, useEffect } from 'react';
import axios from 'axios';
import Charts from '../Chart/Charts';
import Temperature from '../dht11/temperature';
import Humidity from '../dht11/humidity';
import Light from '../dht11/light';
import Menu from '../menu/menu';
import mqtt from 'precompiled-mqtt';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './page.css'

// Khai báo các biến hằng
const urlLedOn = "/light_on.jpg";
const urlLedOff = "/light_off.jpg";
const urlFanOn = "/fan_on.gif";
const urlFanOff = "fan_off.png";
const urlAirOn = "/air_on.gif";
const urlAirOff = "air_off.png";

const TOPIC_IOT_WEATHER = 'iot/weather';
const TOPIC_IOT_LED_FAN_AIR = 'iot/ledFanAir';
const TOPIC_CONTROL_LED = 'control/led';
const TOPIC_CONTROL_FAN = 'control/fan';
const TOPIC_CONTROL_AIR = 'control/air';

const Page = () => {
    // Khởi tạo các trạng thái cho đèn và quạt
    
    const [isLedOn, setIsLedOn] = useState(false);
    const [isFanOn, setIsFanOn] = useState(false);
    const [isAirOn, setIsAirOn] = useState(false);

    const [temperature, setTemperature] = useState(50); // Giả định nhiệt độ
    const [humidity, setHumidity] = useState(90); // Giả định độ ẩm
    const [light, setLight] = useState(1000); // Giả định độ sáng


    useEffect(() =>
    {
        toggleLed(false);
        toggleAir(false);
        toggleFan(false);
    },[]
    )

    setInterval(() => {
        fetch(`http://localhost:8080/get-sensor`)
        .then((response) => response.json())
                .then((datasub) => {

                // Kiểm tra nếu có các trường như 'temperature', 'humidity' và 'light' trong dữ liệu nhận được
                if (datasub.temperature !== undefined && datasub.humidity !== undefined && datasub.light !== undefined) {
                    setTemperature(datasub.temperature);
                    setHumidity(datasub.humidity);
                    setLight(datasub.light);
                }
                })
                .catch((error) => {
                    console.error('Lỗi khi gửi yêu cầu API:', error);
                });
    }, 2000);


    // Hàm bật/tắt đèn
    const toggleLed = (status) => {
        fetch('http://localhost:8080/set-light-led', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lightStatus: status }),
        })
            .then((response) => response.json())
            .then((datasub) => {
                console.log("Message: " + datasub);
                setIsLedOn(datasub);
            })
            .catch((error) => {
                console.error('Lỗi khi gửi yêu cầu API:', error);
            });
    };

    // Hàm bật/tắt quạt
    const toggleFan = (status) => {
        fetch('http://localhost:8080/set-fan-led', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fanStatus: status }),
        })
            .then((response) => response.json())
            .then((datasub) => {
                console.log("Message: " + datasub);
                setIsFanOn(datasub);
            })
            .catch((error) => {
                console.error('Lỗi khi gửi yêu cầu API:', error);
            });
    };

    // Hàm bật/tắt điều hòa
    const toggleAir = (status) => {
        fetch('http://localhost:8080/set-air-led', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ airStatus: status }),
        })
            .then((response) => response.json())
            .then((datasub) => {
                console.log("Message: " + datasub);
                setIsAirOn(datasub);
            })
            .catch((error) => {
                console.error('Lỗi khi gửi yêu cầu API:', error);
            });
    };

    // Render giao diện
    return (
        <>
            <div className="pagee">
                <div className="menuu">
                    <Menu />
                </div>

                {/* Render các thông số hiển thị */}
                <div className="page-chucnang">
                    <Temperature temperature={temperature} />
                    <Humidity humidity={humidity} />
                    <Light light={light} />
                    {/* <Dust dust={dust} /> */}
                </div>

                <div className="page-btn">
                    <div className="page-bieudo">
                        <Charts thoitiet={[temperature, humidity, light]} />
                        {/* <Chartdobui dobui={dust} ></Chartdobui> */}
                    </div>

                    <div className="page-btn-chucnang">
                        <div className="page-btn-den">
                            <div className="btn-icon">
                                <p>Trạng thái đèn</p>
                                <img className="btn-icon-den" src={isLedOn ? urlLedOn : urlLedOff} alt="Bulb" />
                                <br />
                                <button className={`light-btn ${isLedOn ? 'on' : 'off'}`} onClick={() => toggleLed(!isLedOn)}>
                                    <span className="light-icon"></span>
                                </button>
                            </div>


                        </div>

                        <div className="page-btn-quat">
                            <div className="btn-icon">
                                <p>Trạng thái quạt</p>
                                <img className="btn-icon-den" src={isFanOn ? urlFanOn : urlFanOff} alt="Bulb" />
                                <br />
                                <button className={`light-btn ${isFanOn ? 'on' : 'off'}`} onClick={() => toggleFan(!isFanOn)}>
                                    <span className="light-icon"></span>
                                </button>
                            </div>
                        </div>

                        <div className="page-btn-dieu-hoa">
                            <div className="btn-icon">
                                <p>Trạng thái điều hòa</p>
                                <img className="btn-icon-den" src={isAirOn ? urlAirOn : urlAirOff} alt="Bulb" />
                                <br />
                                <button className={`light-btn ${isAirOn ? 'on' : 'off'}`} onClick={() => toggleAir(!isAirOn)}>
                                    <span className="light-icon"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Page

/*
- MQTT: push từ web, sub từ arduino
- Arduino: push nhiệt độ độ ẩm, 
*/