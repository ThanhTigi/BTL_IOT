import React, { useState, useEffect } from 'react';
import Menu from '../menu/menu';
import moment from 'moment';
import './dataLedFan.css';

function DataLedFan() {
    const [historyfanlight, setHistoryfanlight] = useState(null);
    const [deviceName, setDeviceName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tempInputPage, setTempInputPage] = useState(20); // Khởi tạo với 20
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        let url = `http://localhost:8080/fanlights`;

        // Thêm lọc thiết bị
        if (deviceName) {
            url += `/search?deviceName=${deviceName}`;
        }

        // Thêm lọc theo ngày
        if (selectedDate) {
            url += `${deviceName ? '&' : '?'}date=${selectedDate}`;
        }

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((item, index) => {
                    item.id = index + 1;
                    item.date = moment(item.date).format('YYYY-MM-DD HH:mm:ss');
                });

                const reversedData = data.map((item, index, array) => ({
                    ...array[array.length - 1 - index],
                    id: item.id,
                }));

                const totalPages = Math.ceil(reversedData.length / rowsPerPage);
                setTotalPages(totalPages);

                const startIndex = (currentPage - 1) * rowsPerPage;
                const endIndex = startIndex + rowsPerPage;
                const slicedData = reversedData.slice(startIndex, endIndex);

                setHistoryfanlight(slicedData);
            })
            .catch((error) => {
                console.error('Lỗi khi gửi yêu cầu API:', error);
            });
    }, [currentPage, deviceName, rowsPerPage, selectedDate]);

    const handleUpdateRowsPerPage = () => {
        const newRowsPerPage = parseInt(tempInputPage, 10);
        if (newRowsPerPage > 0) {
            setRowsPerPage(newRowsPerPage);
            setCurrentPage(1);
        }
    };

    const handleDeleteData = () => {
        fetch(`http://localhost:8080/deleteAll`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    setHistoryfanlight([]);
                    setCurrentPage(1);
                } else {
                    console.error('Lỗi khi xóa dữ liệu');
                }
            })
            .catch((error) => {
                console.error('Lỗi khi gửi yêu cầu xóa:', error);
            });
    };

    return (
        <div>
            <div className="menuu">
                <Menu />
            </div>
            <div className='container-data'>
                <h1>Lịch sử bật tắt thiết bị</h1>

                {/* Tìm kiếm theo tên thiết bị */}
                <div>
                    <select value={deviceName} onChange={(e) => setDeviceName(e.target.value)} className="rows-per-page-select">
                        <option value="">Chọn thiết bị</option>
                        <option value="đèn">Đèn</option>
                        <option value="quạt">Quạt</option>
                        <option value="điều hòa">Điều hòa</option>
                    </select>

                    <label htmlFor="dateSelect">Chọn ngày: </label>
                    <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)} 
                        id="dateSelect" 
                        className='rows-per-page-select'
                    />  

                    <button className='btn-exit btn-exit-clear bi bi-trash' onClick={handleDeleteData}>Xóa dữ liệu</button>
                </div>

                {historyfanlight && (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên thiết bị</th>
                                <th>Trạng thái</th>
                                <th>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyfanlight.map((data) => {
                                const isOn = data.status === "Bật";
                                const rowClass = isOn ? "green-row" : "red-row";
                                return (
                                    <tr className={rowClass} key={data.id}>
                                        <td>{data.id}</td>
                                        <td>{data.name}</td>
                                        <td>{data.status}</td>
                                        <td>{data.date}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {/* Ô chọn số hàng mỗi trang */}
                <div className='rows-per-page'>
                    <label htmlFor="rowsPerPageSelect">Số hàng mỗi trang: </label>
                    <select
                        id="rowsPerPageSelect"
                        value={tempInputPage}
                        onChange={(e) => setTempInputPage(e.target.value)} // Chỉ cập nhật giá trị tạm
                        onBlur={handleUpdateRowsPerPage} // Gọi hàm khi ô mất focus
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

export default DataLedFan;
