import React from 'react';
import './myprofile.css';
import Menu from '../menu/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdCard, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Myprofile = () => {
    return (
        <div className="mybackground">
            <div className="menuu">
                <Menu />
            </div>
            <img className="imgavt" src="/anh.jpg" alt="Avatar" />
            <div className="mythongtin">
                <FontAwesomeIcon icon={faUser} className="icon" />
                Họ tên: Nguyễn Đắc Thành
            </div>
            <div className="mythongtin">
                <FontAwesomeIcon icon={faIdCard} className="icon" />
                MSV: B21DCCN678
            </div>
            <div className="mythongtin">
                <FontAwesomeIcon icon={faUsers} className="icon" />
                Lớp: D21CQCN06-B
            </div>
            <div className="mythongtin">
                <FontAwesomeIcon icon={faGithub} className="icon" />
                Github: <a href="https://github.com/ThanhTigi/BTL_IOT" target="_blank" rel="noopener noreferrer">Link Github</a>
            </div>
            <div className="mythongtin">
                PDF: <a href="https://drive.google.com/file/d/1aaFpQO_DTU3EBnlALaS0DdJ3a6jeH0Mo/view?usp=sharing" target="_blank" rel="noopener noreferrer">Link PDF</a>
            </div>
            <div className="mythongtin">
                APIDocs:  <a href="https://github.com/ThanhTigi/BTL_IOT/blob/main/APIDocs" target="_blank" rel="noopener noreferrer">Link APIDocs</a>
            </div>
        </div>
    );
}

export default Myprofile;
