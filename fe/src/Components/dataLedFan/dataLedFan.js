import React, { useState, useEffect } from 'react';
import Menu from '../menu/menu';
import moment from 'moment';
import "./dataLedFan.css"

function DataLedFan() {

    const [historyfanlight, setHistoryfanlight] = useState(null);
    const [thoigian, setThoigian] = useState('');
    const [thoigiandata, setThoigiandata] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [inputPage, setInputPage] = useState(currentPage);
    const [tempInputPage, setTempInputPage] = useState(''); // State tạm thời
    const [searchClicked, setSearchClicked] = useState(false);
    const [isValidFormat, setIsValidFormat] = useState(true);
    const rowsPerPage = 20;

    useEffect(() => {
        // Gửi yêu cầu API và lấy dữ liệu
        fetch(`http://localhost:8080/${searchClicked ? `searchfanlight?startTime=${thoigian} 00:00:00&endTime=${thoigian} 23:59:59` : `fanlights`}`) // Thay thế URL_API_CUBAN bằng URL API thực tếA_
            .then((response) => response.json())
            .then((data) => {
                data.forEach((item) => {
                    item.thoigian = moment(item.thoigian).format('YYYY-MM-DD HH:mm:ss');
                });

                const totalPages = Math.ceil(data.length / rowsPerPage);
                setTotalPages(totalPages);

                // Cắt lát dữ liệu dựa trên trang hiện tại và rowsPerPage
                const startIndex = (currentPage - 1) * rowsPerPage;
                const endIndex = startIndex + rowsPerPage;
                const slicedData = data.slice(startIndex, endIndex);
                setInputPage(currentPage.toString()); // Chuyển currentPage thành chuỗi
                setHistoryfanlight(slicedData);
            })
            .catch((error) => {
                console.error('Lỗi khi gửi yêu cầu API:', error);
            });
    }, [currentPage, searchClicked, thoigiandata]);

    const handlePageInputChange = (e) => {
        setTempInputPage(e.target.value); // Cập nhật giá trị tạm thời
    };

    const handlePageInputEnter = (e) => {
        if (e.key === 'Enter') {
            const newPage = parseInt(e.target.value, 10);
            if (newPage >= 1 && newPage <= totalPages) {
                setCurrentPage(newPage);
                setTempInputPage('');
                setTempInputPage('')
            }
        }
    };
    const handleSearch = () => {
        if (thoigian !== '') {
            if (isValidDateFormat(thoigian)) {
                setSearchClicked(true);
                setThoigiandata(thoigian.trim());
                setIsValidFormat(true);
            } else {
                setIsValidFormat(isValidDateFormat(thoigian));
            }
        }
        else {
            setSearchClicked(false);
            setIsValidFormat(true);
        }
        setCurrentPage(1);
    };
    const handleExit = () => {
        setCurrentPage(1);
        setSearchClicked(false);
        setIsValidFormat(true);
        setThoigian('');
    };
    function isValidDateFormat(input) {
        // Sử dụng regex để kiểm tra định dạng
        const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
        return dateFormat.test(input);
    }
    const handlePageInputSearch = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    return (
        <div>
            <div className="menuu">
                <Menu />
            </div>
            <div className='container-data'>
                <h1>Lịch sử bật tắt thiết bị</h1>

                {historyfanlight && (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên thiết bị </th>
                                <th>Trạng thái</th>
                                <th>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                historyfanlight.map((data) => {
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
                                })
                            }
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

                    {/* Hiển thị trang đầu tiên nếu currentPage > 2 */}
                    {currentPage > 2 && (
                        <>
                            <button
                                className={`page-number ${currentPage === 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(1)}
                            >
                                1
                            </button>
                            {currentPage > 3 && <span>...</span>} {/* Dấu ... nếu khoảng cách giữa trang đầu và trang hiện tại > 1 */}
                        </>
                    )}

                    {/* Hiển thị các trang lân cận trang hiện tại */}
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

                    {/* Hiển thị trang cuối cùng nếu currentPage < totalPages - 1 */}
                    {currentPage < totalPages - 1 && (
                        <>
                            {currentPage < totalPages - 2 && <span>...</span>} {/* Dấu ... nếu khoảng cách giữa trang cuối và trang hiện tại > 1 */}
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
