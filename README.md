# Bảng Điều Khiển IoT

Đây là một dự án IoT nhằm mục đích giám sát và điều khiển thiết bị điện từ xa thông qua mạng Internet. Dự án được xây dựng dựa trên nền tảng phần cứng và phần mềm, bao gồm mã nhúng trên vi điều khiển **ESP32**, máy chủ backend với **Java**, và giao diện frontend sử dụng **ReactJS**. Dự án được thực hiện trong khuôn khổ môn học **IoT và Ứng dụng** tại Học viện Công nghệ Bưu chính Viễn thông (PTIT) dưới sự hướng dẫn của thầy **Nguyễn Quốc Uy**.

## Mục Tiêu Dự Án

- Xây dựng hệ thống IoT hoàn chỉnh để đo lường và giám sát các thông số môi trường như **nhiệt độ**, **độ ẩm**, và **ánh sáng** thông qua giao diện web.
- Cung cấp khả năng **điều khiển từ xa** các thiết bị điện như đèn, quạt, và điều hòa để nâng cao tính tiện lợi và tự động hóa.
- Tạo giao diện người dùng **thân thiện** và trực quan, cho phép người dùng theo dõi và quản lý các thông số cảm biến theo **thời gian thực**.
- Đảm bảo **hiệu suất và tính ổn định** của hệ thống, đồng thời cung cấp các tính năng bảo mật trong quá trình truyền dữ liệu.

## Cấu Trúc Dự Án

- **Phần Mã Nhúng (Embedded Code)**: Chạy trên vi điều khiển **ESP32** để đọc dữ liệu từ các cảm biến và điều khiển thiết bị.
- **Backend (BackEnd_IoT)**: Máy chủ được xây dựng bằng **Java**, có nhiệm vụ thu thập và lưu trữ dữ liệu từ cảm biến, đồng thời xử lý các yêu cầu từ giao diện người dùng.
- **Frontend (frontend_iot)**: Giao diện web phát triển bằng **ReactJS** để cung cấp trải nghiệm người dùng thân thiện, hiển thị dữ liệu môi trường, và cho phép điều khiển thiết bị từ xa.

## Các Thành Phần Phần Cứng

1. **ESP32**: Bộ vi điều khiển trung tâm có khả năng kết nối Wi-Fi, sử dụng để thu thập dữ liệu từ các cảm biến và gửi lên server.
2. **Cảm biến nhiệt độ và độ ẩm (DHT11)**: Được sử dụng để đo nhiệt độ và độ ẩm môi trường.
3. **Cảm biến ánh sáng (LDR)**: Đo cường độ ánh sáng để tối ưu hóa việc điều khiển các thiết bị chiếu sáng.
4. **Đèn LED**: Đại diện cho các thiết bị điện như quạt, đèn, và điều hòa, có thể bật/tắt dựa vào tín hiệu từ server.
5. **MQTT Broker**: Sử dụng **Mosquitto** để truyền dữ liệu giữa ESP32 và backend, giúp đảm bảo việc trao đổi thông tin diễn ra mượt mà và thời gian thực.

## Thiết Lập Dự Án

### 1. Thiết Lập Mã Nhúng

1. **Cài Đặt Arduino IDE**.
2. **Cài Đặt Thư Viện Cần Thiết** từ thư mục `embedded/lib`.
3. **Mở Arduino IDE**, tạo một dự án mới và dán mã từ `sketch_aug18a.ino`.
4. **Nạp mã lên ESP32**.

### 2. Thiết Lập Backend

1. Di chuyển tới thư mục backend:

```bash
   cd be/
```
Cài đặt các gói phụ thuộc:

```bash
npm install
```
Khởi động máy chủ:

```bash
node server.js
```
3. Thiết Lập Frontend
Di chuyển tới thư mục frontend:

```bash
cd fe/
```
Cài đặt các gói phụ thuộc:

```bash
npm install
```
Khởi động ứng dụng frontend:

```bash
npm start
```
Giao Diện Người Dùng
Menu Chính: Cung cấp các tùy chọn như Dashboard, Data Sensor, Action History, và Profile.
Dashboard: Hiển thị các thông số môi trường theo thời gian thực, cung cấp các nút điều khiển thiết bị điện.
Data Sensor: Trình bày chi tiết dữ liệu thu thập từ các cảm biến, với các tính năng tìm kiếm và phân trang.
Action History: Lưu trữ và quản lý lịch sử thao tác bật/tắt thiết bị điện.
Profile: Hiển thị thông tin cá nhân của người dùng.
Kết Quả Thực Nghiệm
Phần Cứng: Hệ thống phần cứng đã hoạt động ổn định, với các cảm biến cung cấp dữ liệu chính xác và việc điều khiển thiết bị điện được thực hiện thành công.
Frontend: Giao diện người dùng thân thiện, cho phép theo dõi và điều khiển thiết bị một cách linh hoạt và dễ dàng.
Backend: Thành công trong việc kết nối với MQTT Broker, xử lý dữ liệu từ cảm biến, và quản lý cơ sở dữ liệu.
Đóng Góp
Mọi đóng góp cho dự án đều được hoan nghênh! Nếu bạn có bất kỳ vấn đề hoặc đề xuất nào, hãy thoải mái mở issue hoặc pull request. Sự tham gia của bạn sẽ giúp dự án phát triển mạnh mẽ hơn.

Dự án được thực hiện với niềm đam mê và nhiệt huyết của sinh viên Nguyễn Đắc Thành - B21DCCN678 lớp D21CQCN06-B thuộc PTIT. Chúc bạn trải nghiệm thú vị cùng với dự án IoT này!
