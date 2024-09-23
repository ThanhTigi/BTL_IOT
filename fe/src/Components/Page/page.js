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
import Dust from '../dht11/dust';
import Chartdobui from '../chartDobui/chartDobui';

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
    const [dust, setDust] = useState(60);

    const [isUpload, setIsUpload] = useState(false);

    const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt'); // Tạo một MQTT client

    useEffect(() => {
        console.log("sub");
        client.on('connect', () => {
            console.log("Connected to broker");
            client.subscribe(TOPIC_IOT_WEATHER);
            client.subscribe(TOPIC_IOT_LED_FAN_AIR);
        });
    
        client.on('error', (err) => {
            console.error("Connection error: ", err);
            client.reconnect();
        });
    
        client.on('offline', () => {
            console.warn("Client is offline, trying to reconnect...");
            client.reconnect();
        });
        // Khi kết nối thành công, subscribe các topic
        client.subscribe(TOPIC_IOT_WEATHER);
        client.subscribe(TOPIC_IOT_LED_FAN_AIR);

        // Khi nhận được tin nhắn, cập nhật các trạng thái
        client.on('message', (topic, message) => {

            console.log("Topic: " + topic + " - Message: " + message);
            const datasub = JSON.parse(message.toString());

            if (topic === TOPIC_IOT_WEATHER) {

                // Kiểm tra nếu có các trường như 'temperature', 'humidity' và 'light' trong dữ liệu nhận được
                if (datasub.temperature !== undefined && datasub.humidity !== undefined && datasub.light !== undefined && datasub.dust !== undefined) {
                    setTemperature(datasub.temperature);
                    setHumidity(datasub.humidity);
                    setLight(datasub.light);
                    setDust(datasub.dust);

                    // gui du lieu len database
                    postDataSensorToDatabase(datasub.temperature, datasub.humidity, datasub.light, datasub.dust);
                }
            }
            else if (topic === TOPIC_IOT_LED_FAN_AIR) {
                if (datasub.led !== undefined && datasub.fan !== undefined && datasub.air !== undefined) {
                    if (datasub.led === 'on') {
                        setIsLedOn(true);
                    } else {
                        setIsLedOn(false);
                    }
                    if (datasub.fan === 'on') {
                        setIsFanOn(true);
                    } else {
                        setIsFanOn(false);
                    }
                    if (datasub.air === 'on') {
                        setIsAirOn(true);
                    } else {
                        setIsAirOn(false);
                    }
                }
            }
        });

        // Khi destroy
        return () => {
            console.log("unsub");
            client.unsubscribe(TOPIC_IOT_WEATHER);
            client.unsubscribe(TOPIC_IOT_LED_FAN_AIR);
        };
    }, []);


    // gửi dữ liệu sensor lên db
    function postDataSensorToDatabase(nhietdo, doam, anhsang, dobui) {
        if (!isUpload) {
            setIsUpload(true);
            axios.post('http://localhost:8080/add-sensor', {
                temperature: nhietdo,
                humidity: doam,
                light: anhsang,
                dust: dobui
            })
                .then((response) => {
                    console.log('Dữ liệu đã được gửi thành công tu page:', response.data);
                    // Thực hiện các hành động khác sau khi gửi dữ liệu thành công (nếu cần)
                })
                .catch((error) => {
                    console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
                    // Xử lý lỗi (nếu cần)
                })
                .finally(() => {
                    setIsUpload(false);
                });
        }
    }

    // gửi lịch sử bật tắt lên database
    function postLedFanToDatabase(ten, trangthai) {
        axios.post('http://localhost:8080/add-ledfan', {
            name: ten,
            status: trangthai
        })
            .then((response) => {
                console.log('Dữ liệu đã được gửi thành công tu page:', response.data);
                // Thực hiện các hành động khác sau khi gửi dữ liệu thành công (nếu cần)
            })
            .catch((error) => {
                console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
                // Xử lý lỗi (nếu cần)
            });
    }


    // Hàm bật/tắt đèn
    const toggleLed = () => {
        setIsLedOn(prevState => !prevState);
    };
    useEffect(() => {
        client.on('error', (err) => {
            console.error("Connection error: ", err);
            client.reconnect();
        });
    
        client.on('offline', () => {
            console.warn("Client is offline, trying to reconnect...");
            client.reconnect();
        });
        // Gửi tin nhắn MQTT khi đèn được bật hoặc tắt
        const message = isLedOn ? 'Bật' : 'Tắt';
        client.publish(TOPIC_CONTROL_LED, message, {}, (error) => {
            if (error) {
                console.error("Publish failed: ", error);
            } else {
                postLedFanToDatabase('Led', message);
                console.log("Publish success to topic: " + TOPIC_CONTROL_LED);
            }
        });
        
    }, [isLedOn]);

    // Hàm bật/tắt quạt
    const toggleFan = () => {
        setIsFanOn(prevState => !prevState);
    };
    useEffect(() => {
        // Gửi tin nhắn MQTT khi đèn được bật hoặc tắt
        const message = isFanOn ? 'Bật' : 'Tắt';
        client.publish(TOPIC_CONTROL_FAN, message, {}, (error) => {
            if (error) {
                console.error("Publish failed: ", error);
            } else {
                postLedFanToDatabase('Fan', message);
                console.log("Publish success to topic: " + TOPIC_CONTROL_FAN);
            }
        });
        
    }, [isFanOn]);

    // Hàm bật/tắt điều hòa
    const toggleAir = () => {
        setIsAirOn(prevState => !prevState);
    };
    useEffect(() => {
        // Gửi tin nhắn MQTT khi điều hòa được bật hoặc tắt
        const message = isAirOn ? 'Bật' : 'Tắt';
        client.publish(TOPIC_CONTROL_AIR, message, {}, (error) => {
            if (error) {
                console.error("Publish failed: ", error);
            } else {
                postLedFanToDatabase('Air', message);
                console.log("Publish success to topic: " + TOPIC_CONTROL_AIR);
            }
        });
        
    }, [isAirOn]);




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
                                <button className={`light-btn ${isLedOn ? 'on' : 'off'}`} onClick={toggleLed}>
                                    <span className="light-icon"></span>
                                </button>
                            </div>


                        </div>

                        <div className="page-btn-quat">
                            <div className="btn-icon">
                                <p>Trạng thái quạt</p>
                                <img className="btn-icon-den" src={isFanOn ? urlFanOn : urlFanOff} alt="Bulb" />
                                <br />
                                <button className={`light-btn ${isFanOn ? 'on' : 'off'}`} onClick={toggleFan}>
                                    <span className="light-icon"></span>
                                </button>
                            </div>
                        </div>

                        <div className="page-btn-dieu-hoa">
                            <div className="btn-icon">
                                <p>Trạng thái điều hòa</p>
                                <img className="btn-icon-den" src={isAirOn ? urlAirOn : urlAirOff} alt="Bulb" />
                                <br />
                                <button className={`light-btn ${isAirOn ? 'on' : 'off'}`} onClick={toggleAir}>
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