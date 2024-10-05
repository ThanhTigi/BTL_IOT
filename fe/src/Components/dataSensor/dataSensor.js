import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Menu from '../menu/menu';
import './dataSensor.css';

function DataSensor() {
    const [listDataSensor, setListDataSensor] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [tempInputPage, setTempInputPage] = useState(20); // Trạng thái nhập tạm thời cho số hàng mỗi trang
    const [rowsPerPage, setRowsPerPage] = useState(20); // Trạng thái số hàng mỗi trang

    const [temperatureInput, setTemperatureInput] = useState('');
    const [humidityInput, setHumidityInput] = useState('');
    const [lightInput, setLightInput] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);
    const [isClear, setIsClear] = useState(false);

    useEffect(() => {
        // Gửi yêu cầu API và lấy dữ liệu
        function callapi() {
            fetch(`http://localhost:8080/${searchClicked ? `search-sensor?temperature=${temperatureInput}&humidity=${humidityInput}&light=${lightInput}` : `sensors`}`)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        item.id = index + 1; // Gán ID bắt đầu từ 1
                        item.date = moment(item.date).format('YYYY-MM-DD HH:mm:ss');
                    });

                    setTotalPages(Math.ceil(data.length / rowsPerPage)); // Tính tổng số trang
                    const startIndex = (currentPage - 1) * rowsPerPage;
                    const endIndex = startIndex + rowsPerPage;
                    const slicedData = data.slice(startIndex, endIndex);

                    // Không cần sắp xếp lại vì ID đã được gán từ bé đến lớn
                    setListDataSensor(slicedData);
                })
                .catch((error) => {
                    console.error('Lỗi khi gửi yêu cầu API:', error);
                });
        }

        const interval = setInterval(callapi, 2000);
        return () => {
            clearInterval(interval);
        };
    }, [currentPage, isClear, searchClicked, rowsPerPage]);     // Thêm rowsPerPage vào dependency array



    const handleSearch = () => {
        if (temperatureInput !== '' || humidityInput !== '' || lightInput !== '') {
            setSearchClicked(true);
        } else {
            setSearchClicked(false);
        }
        setCurrentPage(1);
    };

    const handleExit = () => {
        setCurrentPage(1);
        setSearchClicked(false);
        setTemperatureInput('');
        setHumidityInput('');
        setLightInput('');
    };

    const handleClear = () => {
        if (!isClear) {
            setIsClear(true);

            fetch(`http://localhost:8080/clear-sensor`)
                .then((response) => {
                    console.log('Dữ liệu đã được xóa thành công:');
                    // Thực hiện các hành động khác sau khi xóa dữ liệu thành công (nếu cần)
                })
                .catch((error) => {
                    console.error('Đã xảy ra lỗi khi xóa dữ liệu:', error);
                    // Xử lý lỗi (nếu cần)
                })
                .finally(() => {
                    // de refesh lai trang
                    setIsClear(false);
                });
        }
    };

    const handleUpdateRowsPerPage = (newRowsPerPage) => {
        if (newRowsPerPage > 0) {
            setRowsPerPage(newRowsPerPage);
            setCurrentPage(1); // Reset về trang đầu
        }
    };

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
                    />
                    <input
                        className='search-ip'
                        type="text"
                        placeholder="Độ ẩm (%)"
                        value={humidityInput}
                        onChange={(e) => setHumidityInput(e.target.value)}
                    />
                    <input
                        className='search-ip'
                        type="text"
                        placeholder="Ánh sáng (lux)"
                        value={lightInput}
                        onChange={(e) => setLightInput(e.target.value)}
                    />
                    <button className='btn-exit btn-exit-search bi bi-search' onClick={handleSearch}>Tìm kiếm</button>
                    <button className='btn-exit btn-exit-exit bi bi-card-list' onClick={() => handleExit()}> Tất cả</button>
                    <button className='btn-exit btn-exit-clear bi bi-trash' onClick={() => handleClear()}> Xóa dữ liệu</button>
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
                            {listDataSensor.map((data) => (
                                <tr key={data.id}>
                                    <td>{data.id}</td>
                                    <td>{data.temperature}</td>
                                    <td>{data.humidity}</td>
                                    <td>{data.light}</td>
                                    <td>{data.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}


                {/* Ô chọn số hàng mỗi trang */}
                <div className='rows-per-page'>
                    <label htmlFor="rowsPerPageSelect">Số hàng mỗi trang: </label>
                    <select
                        id="rowsPerPageSelect"
                        value={tempInputPage}
                        onChange={(e) => {
                            const newValue = parseInt(e.target.value);
                            setTempInputPage(newValue);
                            handleUpdateRowsPerPage(newValue);
                        }}
                        className="rows-per-page-select"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={40}>40</option>
                        <option value={50}>50</option>
                    </select>
                </div>


                {/* Phân trang */}
                <div className="pagination">
                    <button
                        className='btn-pagination btn-prev'
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Trước
                    </button>
                    {currentPage > 2 && (
                        <>
                            <button
                                className={`page-number ${currentPage === 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(1)}
                            >
                                1
                            </button>
                            {currentPage > 3 && <span className="dots">...</span>}
                        </>
                    )}
                    {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        if (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) {
                            return (
                                <button
                                    key={pageNum}
                                    className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        }
                        return null;
                    })}
                    {currentPage < totalPages - 1 && (
                        <>
                            {currentPage < totalPages - 2 && <span className="dots">...</span>}
                            <button
                                className={`page-number ${currentPage === totalPages ? 'active' : ''}`}
                                onClick={() => setCurrentPage(totalPages)}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                    <button
                        className='btn-pagination btn-next'
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Tiếp
                    </button>
                </div>

            </div>
        </div>
    );

}

export default DataSensor;
