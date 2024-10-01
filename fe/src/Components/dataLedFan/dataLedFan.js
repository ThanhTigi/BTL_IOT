import React, { useState, useEffect } from 'react';
import Menu from '../menu/menu';
import moment from 'moment';
import './dataLedFan.css';

function DataLedFan() {
    const [historyfanlight, setHistoryfanlight] = useState(null);
    const [deviceName, setDeviceName] = useState(''); // State để lưu tên thiết bị
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tempInputPage, setTempInputPage] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(20); // State để điều chỉnh số lượng hàng

    useEffect(() => {
        // Gửi yêu cầu API và lấy dữ liệu
        fetch(`http://localhost:8080/fanlights${deviceName ? `/search?deviceName=${deviceName}` : ''}`)
            .then((response) => response.json())
            .then((data) => {
                // Format lại thời gian cho từng phần tử
                data.forEach((item,index) => {
                    item.id = index +1;
                    item.date = moment(item.date).format('YYYY-MM-DD HH:mm:ss');
                });

                // Đảo ngược các bản ghi nhưng giữ nguyên cột ID
                const reversedData = data.map((item, index, array) => ({
                    ...array[array.length - 1 - index],  // Lấy phần tử từ cuối của mảng đảo ngược
                    id: item.id  // Giữ nguyên ID từ bản gốc
                }));

                const totalPages = Math.ceil(reversedData.length / rowsPerPage);
                setTotalPages(totalPages);

                // Cắt lát dữ liệu dựa trên trang hiện tại và rowsPerPage
                const startIndex = (currentPage - 1) * rowsPerPage;
                const endIndex = startIndex + rowsPerPage;
                const slicedData = reversedData.slice(startIndex, endIndex);

                setHistoryfanlight(slicedData);
            })
            .catch((error) => {
                console.error('Lỗi khi gửi yêu cầu API:', error);
            });
    }, [currentPage, deviceName, rowsPerPage]);

    const handlePageInputChange = (e) => {
        setTempInputPage(e.target.value);
    };

    const handleUpdateRowsPerPage = () => {
        const newRowsPerPage = parseInt(tempInputPage, 10);
        if (newRowsPerPage > 0) {
            setRowsPerPage(newRowsPerPage); // Cập nhật số lượng hàng trên mỗi trang
            setCurrentPage(1); // Reset về trang đầu
        }
        setTempInputPage(''); // Xóa ô nhập sau khi cập nhật
    };

    const handleDeleteData = () => {
        fetch(`http://localhost:8080/deleteAll`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    // Sau khi xóa thành công, gọi lại API để lấy dữ liệu mới
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
                    <select value={deviceName} onChange={(e) => setDeviceName(e.target.value)}>
                        <option value="">Chọn thiết bị</option>
                        <option value="đèn">Đèn</option>
                        <option value="quạt">Quạt</option>
                        <option value="điều hòa">Điều hòa</option>
                    </select>
                    <button className='btn-exit btn-exit-clear bi bi-trash' onClick={handleDeleteData}>Xóa dữ liệu</button> {/* Nút Xóa dữ liệu */}
                               
                </div>
                <br></br>
                <div className='rows-per-page'>
                <label htmlFor="rowsPerPageInput">Số hàng mỗi trang: </label>
                <input
                        id="rowsPerPageInput"
                        type="number"
                        value={tempInputPage}
                        onChange={handlePageInputChange}
                        min="1"
                    />
                    <button className='btn-ok' onClick={handleUpdateRowsPerPage}>OK</button> {/* Nút OK để cập nhật */}
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

                <div className="pagination">
                    <button
                        className='btn-truoc'
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
                            {currentPage > 3 && <span>...</span>}
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
                            {currentPage < totalPages - 2 && <span>...</span>}
                            <button
                                className={`page-number ${currentPage === totalPages ? 'active' : ''}`}
                                onClick={() => setCurrentPage(totalPages)}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        className='btn-tiep'
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
