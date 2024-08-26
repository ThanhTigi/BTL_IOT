import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Menu from '../menu/menu';
import './dataSensor.css';

function DataSensor() {

    const [listDataSensor, setListDataSensor] = useState(null);

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [inputPage, setInputPage] = useState(currentPage);
    const [tempInputPage, setTempInputPage] = useState(''); // page tạm thời

    const [temperatureInput, setTemperatureInput] = useState(''); // Thêm trường nhập nhiệt độ
    const [humidityInput, setHumidityInput] = useState(''); // Thêm trường nhập độ ẩm
    const [lightInput, setLightInput] = useState(''); // Thêm trường nhập ánh sáng

    const [temperature, setTemperature] = useState(''); // Thêm trường nhập nhiệt độ
    const [humidity, setHumidity] = useState(''); // Thêm trường nhập độ ẩm
    const [light, setLight] = useState(''); // Thêm trường nhập ánh sáng

    const [searchClicked, setSearchClicked] = useState(false);
    const [isClear, setIsClear] = useState(false);

    const rowsPerPage = 20;

    // Fake data tạm thời
    const fakeData = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        temperature: (Math.random() * 40).toFixed(2), // Nhiệt độ ngẫu nhiên từ 0 đến 40°C
        humidity: (Math.random() * 100).toFixed(2), // Độ ẩm ngẫu nhiên từ 0 đến 100%
        light: (Math.random() * 1000).toFixed(2), // Ánh sáng ngẫu nhiên từ 0 đến 1000 lux
        date: moment().format('YYYY-MM-DD HH:mm:ss'), // Thời gian hiện tại
    }));

    useEffect(() => {
        function callapi() {
            // Khi chưa có API, sử dụng dữ liệu fake
            let data = fakeData;

            // Thực hiện tìm kiếm nếu searchClicked = true
            if (searchClicked) {
                data = fakeData.filter((item) => {
                    const tempMatches = temperature ? Math.round(item.temperature) === parseInt(temperature) : true;
                    const humidityMatches = humidity ? Math.round(item.humidity) === parseInt(humidity) : true;
                    const lightMatches = light ? Math.round(item.light) === parseInt(light) : true;
                    return tempMatches && humidityMatches && lightMatches;
                });
            }

            setTotalPages(Math.ceil(data.length / rowsPerPage)); // Tính tổng số trang
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const slicedData = data.slice(startIndex, endIndex);
            setInputPage(currentPage.toString()); // Chuyển currentPage thành chuỗi
            setListDataSensor(slicedData);
        }

        callapi();
    }, [currentPage, searchClicked, temperature, humidity, light]);

    const handlePageInputChange = (e) => {
        setTempInputPage(e.target.value); // Cập nhật giá trị tạm thời
    };

    const handlePageInputEnter = (e) => {
        if (e.key === 'Enter') {
            const newPage = parseInt(e.target.value, 10);
            if (newPage >= 1 && newPage <= totalPages) {
                setCurrentPage(newPage);
                setTempInputPage('');
            }
        }
    };

    const handleSearch = () => {
        if (temperatureInput !== '' || humidityInput !== '' || lightInput !== '') {
            setTemperature(temperatureInput.trim());
            setHumidity(humidityInput.trim());
            setLight(lightInput.trim());
            setSearchClicked(true);
        } else {
            setSearchClicked(false);
        }
        setCurrentPage(1);
    };

    const handlePageSearchEnter = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleExit = () => {
        setCurrentPage(1);
        setSearchClicked(false);
        setTemperatureInput('');
        setHumidityInput('');
        setLightInput('');
    };

    let rowCount = 0; // check hàng chẵn - lẻ

    return (
        <div className='menu-data'>
            <div className="menuu">
                <Menu />
            </div>
            <div className='container-data'>
                <h1>Dữ liệu cảm biến</h1>
                <div className='search-khung'>
                    <input
                        className='search-ip'
                        type="text"
                        placeholder="Nhiệt độ (°C)"
                        value={temperatureInput}
                        onChange={(e) => setTemperatureInput(e.target.value)}
                        onKeyPress={handlePageSearchEnter}
                    />
                    <input
                        className='search-ip'
                        type="text"
                        placeholder="Độ ẩm (%)"
                        value={humidityInput}
                        onChange={(e) => setHumidityInput(e.target.value)}
                        onKeyPress={handlePageSearchEnter}
                    />
                    <input
                        className='search-ip'
                        type="text"
                        placeholder="Ánh sáng (lux)"
                        value={lightInput}
                        onChange={(e) => setLightInput(e.target.value)}
                        onKeyPress={handlePageSearchEnter}
                    />
                    <button className='btn-exit btn-exit-search bi bi-search' onClick={() => handleSearch()}> Tìm kiếm</button>
                    <button className='btn-exit btn-exit-exit bi bi-card-list' onClick={() => handleExit()}> Tất cả</button>
                </div>

                {listDataSensor && (
                    <table>
                        <thead>
                            <tr className='tr_thoitiet'>
                                <th>ID</th>
                                <th>Nhiệt độ (°C)</th>
                                <th>Độ ẩm (%)</th>
                                <th>Ánh sáng (lux)</th>
                                <th>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listDataSensor.map((data) => {
                                rowCount++; // Tăng biến đếm hàng
                                const isEvenRow = rowCount % 2 === 0;
                                const rowClass = isEvenRow ? "id_chan" : "id_le";
                                return (
                                    <tr className={rowClass} key={data.id}>
                                        <td>{data.id}</td>
                                        <td>{data.temperature}</td>
                                        <td>{data.humidity}</td>
                                        <td>{data.light}</td>
                                        <td>{data.date}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                <div className="pagination">
                    <button className='btn-truoc' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                        Trước
                    </button>
                    <input
                        className='ip-trang'
                        value={tempInputPage}
                        onChange={handlePageInputChange}
                        onKeyPress={handlePageInputEnter}
                        placeholder={inputPage + "/" + totalPages}
                        disabled = {true}
                    />
                    <button className='btn-tiep' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                        Tiếp
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DataSensor;
