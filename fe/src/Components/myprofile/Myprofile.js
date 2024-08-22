import "./myprofile.css"
import Menu from "../menu/menu";

const Myprofile = () => {
    return (
        <div className="mybackground">
            <div className="menuu">
                <Menu />
            </div>
            <img className="imgavt" src="/anh.jpg"></img>
            <div className="mythongtin">Họ tên: Nguyễn Đắc Thành</div>
            <div className="mythongtin">MSV: B21DCCN678 </div>
            <div className="mythongtin">Lớp: D21CQCN06-B </div>
        </div>
    )
}
export default Myprofile;