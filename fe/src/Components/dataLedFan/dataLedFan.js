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

    // Fake data tạm thời cho lịch sử bật tắt đèn và quạt
    const fakeData = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        name: index % 3 === 0 ? 'Đèn' : index % 3 == 1 ? 'Quạt' : 'Điều hòa', // Tên thiết bị là 'Light' hoặc 'Fan' hoặc 'Air Conditioner'
        status: Math.random() > 0.5 ? 'Bật' : 'Tắt', // Trạng thái ngẫu nhiên bật hoặc tắt
        date: moment().subtract(Math.random() * 100, 'days').format('YYYY-MM-DD HH:mm:ss'), // Thời gian ngẫu nhiên trong 100 ngày qua
    }));

    useEffect(() => {
        function callapi() {
            // Khi chưa có API, sử dụng dữ liệu fake
            let data = fakeData;

            // Tính tổng số trang
            const totalPages = Math.ceil(data.length / rowsPerPage);
            setTotalPages(totalPages);

            // Cắt lát dữ liệu dựa trên trang hiện tại và rowsPerPage
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const slicedData = data.slice(startIndex, endIndex);
            setInputPage(currentPage.toString()); // Chuyển currentPage thành chuỗi
            setHistoryfanlight(slicedData);
        }

        callapi();
    }, [currentPage]);

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
    };

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

export default DataLedFan;
