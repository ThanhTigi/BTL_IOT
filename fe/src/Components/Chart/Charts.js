import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LineElement,
    LinearScale,
    PointElement,
    Legend,
    Tooltip,
} from 'chart.js';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend,
    Tooltip
);

function Chart() {
    // Khởi tạo state cho nhiệt độ, độ ẩm, ánh sáng và ngày
    const [data, setData] = useState({
        temperature: [],
        humidity: [],
        light: [],
        date: [],
    });

    // Sử dụng một cờ để kiểm tra xem có đang trong quá trình cập nhật dữ liệu hay không
    const [isUpdatingData, setIsUpdatingData] = useState(false);

    // Hàm fake dữ liệu ngẫu nhiên
    const generateRandomData = () => {
        return {
            temperature: (Math.random() * 40).toFixed(2), // Giả lập nhiệt độ từ 0 đến 40°C
            humidity: (Math.random() * 100).toFixed(2),   // Giả lập độ ẩm từ 0 đến 100%
            light: (Math.random() * 1000).toFixed(2),     // Giả lập ánh sáng từ 0 đến 1000 lux
        };
    };

    // Hàm để cập nhật dữ liệu
    const updateData = () => {
        if (!isUpdatingData) {
            setIsUpdatingData(true);

            // Tạo dữ liệu ngẫu nhiên
            const newData = generateRandomData();
            const newTemperature = newData.temperature;
            const newHumidity = newData.humidity;
            const newLight = newData.light / 10; // Chia ánh sáng để vừa với scale biểu đồ
            const newDate = new Date().toLocaleTimeString();

            // Cập nhật state bằng cách tạo một bản sao của state hiện tại
            const updatedData = { ...data };

            // Giới hạn số lượng dữ liệu hiển thị trên biểu đồ (giữ tối đa 10 giá trị)
            if (updatedData.temperature.length >= 10) {
                updatedData.temperature.shift();
                updatedData.humidity.shift();
                updatedData.light.shift();
                updatedData.date.shift();
            }

            // Thêm dữ liệu mới vào mảng
            updatedData.temperature.push(newTemperature);
            updatedData.humidity.push(newHumidity);
            updatedData.light.push(newLight);
            updatedData.date.push(newDate);

            // Cập nhật state
            setData(updatedData);

            setIsUpdatingData(false); // Đánh dấu việc cập nhật dữ liệu đã hoàn thành
        }
    };

    // Tự động cập nhật dữ liệu mỗi 2 giây
    useEffect(() => {
        const intervalId = setInterval(() => {
            updateData();
        }, 2000);

        // Xóa interval khi component bị hủy
        return () => {
            clearInterval(intervalId);
        };
    }, [data]); // Theo dõi sự thay đổi của dữ liệu

    // Dữ liệu cho biểu đồ
    const chartData = {
        labels: data.date,
        datasets: [
            {
                label: 'Nhiệt độ (°C)',
                data: data.temperature,
                borderColor: '#ff6c03',
                fill: false,
            },
            {
                label: 'Độ ẩm (%)',
                data: data.humidity,
                borderColor: '#00d9ff',
                fill: false,
            },
            {
                label: 'Ánh sáng (lux)',
                data: data.light,
                borderColor: '#b5b800',
                fill: false,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
        },
        elements: {
            point: {
                radius: 2, // Kích thước điểm trên biểu đồ
            },
        },
    };

    return (
        <div>
            <Line data={chartData} options={chartOptions} height={300} width={420} />
        </div>
    );
}

export default Chart;
