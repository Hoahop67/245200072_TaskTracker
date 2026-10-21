# 📋 Task Tracker Dashboard

Ứng dụng quản lý công việc hiện đại với giao diện Dashboard trực quan và backend RESTful API viết bằng **Node.js**.

---

## 📁 Cấu trúc thư mục

```text
Tack Tracker-245200072/
├── app/
│   ├── index.html        # Giao diện Task Tracker Dashboard (HTML5, CSS3, Fetch API)
│   ├── server.js         # Backend Node.js phục vụ index.html tại '/' và API '/api/tasks'
│   └── tasks.json        # File lưu trữ dữ liệu công việc (Database JSON)
├── package.json          # Cấu hình dự án và dependencies
└── README.md             # Hướng dẫn sử dụng
```

---

## ✨ Tính năng chính

### 1. Giao diện người dùng (`app/index.html`)
- **Tiêu đề nổi bật**: `Task Tracker Dashboard` với thiết kế Gradient & Glassmorphism cao cấp.
- **Thống kê thời gian thực**: Thẻ đếm Tổng số việc, Việc chưa xong, Việc đã hoàn thành và Thanh tiến độ (Progress bar).
- **Thêm công việc nhanh chóng**:
  - Ô input `taskInput` nhập tên việc.
  - Phân loại độ ưu tiên (Cao, Trung bình, Thấp) với màu sắc trực quan.
  - Chọn hạn chót (Deadline) và cảnh báo quá hạn.
  - Nút `Thêm Task` (`addTaskBtn`) với hiệu ứng hover và loading.
- **Thao tác linh hoạt**:
  - Checkbox đánh dấu hoàn thành (có gạch ngang chữ và hiệu ứng hoạt họa).
  - Nút Chỉnh sửa tiêu đề, độ ưu tiên, hạn chót qua Modal.
  - Nút Xóa từng việc hoặc Xóa toàn bộ việc đã hoàn thành.
- **Bộ lọc & Tìm kiếm**:
  - Lọc theo: *Tất cả*, *Chưa xong*, *Đã xong*.
  - Thanh tìm kiếm tức thời theo từ khóa.
- **Chế độ Sáng / Tối (Dark / Light Mode)**: Chuyển đổi mượt mà và tự động ghi nhớ cài đặt.
- **Thông báo Toast**: Hiển thị popup thông báo thành công hoặc lỗi tinh tế.

### 2. Backend Node.js (`app/server.js`)
- Phục vụ trang chủ `index.html` khi truy cập đường dẫn gốc `http://localhost:3000/`.
- Cung cấp đầy đủ RESTful API:
  - `GET /api/tasks`: Lấy toàn bộ danh sách công việc.
  - `POST /api/tasks`: Tạo công việc mới (lưu vào `tasks.json`).
  - `PUT` / `PATCH /api/tasks/:id`: Cập nhật trạng thái hoặc thông tin công việc.
  - `DELETE /api/tasks/:id`: Xóa công việc theo ID.
  - `DELETE /api/tasks/completed`: Xóa tất cả công việc đã hoàn thành.
- **Hỗ trợ thông minh**: Tự động nhận diện Express hoặc chạy ngay với module `http` có sẵn của Node.js mà không bắt buộc cài đặt package.

---

## 🚀 Hướng dẫn khởi chạy

### Bước 1: Mở thư mục dự án trong Terminal / PowerShell
```powershell
cd "c:\Tack Tracker-245200072"
```

### Bước 2 (Tùy chọn): Cài đặt thư viện Express
*(Server đã được tích hợp sẵn Native HTTP, nên bước này không bắt buộc)*
```powershell
npm install
```

### Bước 3: Khởi động Server
```powershell
npm start
# hoặc
node app/server.js
```

### Bước 4: Trải nghiệm ứng dụng
Mở trình duyệt web và truy cập:
👉 **[http://localhost:3000](http://localhost:3000)**

---

> 💡 **Mẹo xem trước nhanh**: Bạn có thể click đúp chuột trực tiếp vào file [index.html](file:///c:/Tack%20Tracker-245200072/app/index.html) để mở trên trình duyệt. Ứng dụng sẽ tự động kích hoạt **Chế độ xem trước (Offline / Local)** để bạn trải nghiệm toàn bộ giao diện ngay lập tức!
