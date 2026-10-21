/**
 * Task Tracker - Backend Server (Node.js)
 * 
 * Server này hỗ trợ 2 chế độ:
 * 1. Chế độ Express (tiêu chuẩn khi đã cài đặt dependencies qua npm)
 * 2. Chế độ HTTP Native (dùng module có sẵn của Node.js, hoạt động ngay không cần npm install)
 */

const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const TASKS_FILE = path.join(__dirname, 'tasks.json');
const HTML_FILE = path.join(__dirname, 'index.html');

// Đọc danh sách tasks từ tasks.json (hoặc khởi tạo mặc định nếu chưa có)
function getTasks() {
  try {
    if (fs.existsSync(TASKS_FILE)) {
      const data = fs.readFileSync(TASKS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Lỗi khi đọc file tasks.json:', err.message);
  }
  return [
    {
      id: 'task-1',
      title: 'Thiết kế giao diện Task Tracker Dashboard',
      priority: 'high',
      dueDate: '2026-10-25',
      completed: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-2',
      title: 'Xây dựng RESTful API với Node.js (/api/tasks)',
      priority: 'high',
      dueDate: '2026-10-26',
      completed: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-3',
      title: 'Kết nối Fetch API giữa Frontend và Backend',
      priority: 'medium',
      dueDate: '2026-10-27',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ];
}

// Lưu danh sách tasks vào file tasks.json
function saveTasks(tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
  } catch (err) {
    console.error('Lỗi khi ghi file tasks.json:', err.message);
  }
}

// Thử khởi động với Express nếu có sẵn trong node_modules
function startWithExpress() {
  const express = require('express');
  const app = express();

  // Middleware phân tích JSON và URL-encoded
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Middleware CORS cho phép gọi API từ mọi nguồn
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Phục vụ các tài nguyên tĩnh trong thư mục app
  app.use(express.static(__dirname));

  // Trang chủ: Trả về file index.html
  app.get('/', (req, res) => {
    res.sendFile(HTML_FILE);
  });

  // GET /api/tasks: Lấy danh sách tasks
  app.get('/api/tasks', (req, res) => {
    const tasks = getTasks();
    res.json(tasks);
  });

  // POST /api/tasks: Thêm task mới
  app.post('/api/tasks', (req, res) => {
    const { title, priority, dueDate } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Tiêu đề công việc không được để trống!' });
    }

    const tasks = getTasks();
    const newTask = {
      id: 'task-' + Date.now(),
      title: title.trim(),
      priority: priority || 'medium',
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask);
  });

  // PUT hoặc PATCH /api/tasks/:id: Cập nhật task (hoàn thành, đổi tên, độ ưu tiên)
  const updateHandler = (req, res) => {
    const { id } = req.params;
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => String(t.id) === String(id));

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Không tìm thấy task với ID: ' + id });
    }

    const task = tasks[taskIndex];
    if (req.body.title !== undefined) task.title = req.body.title.trim();
    if (req.body.priority !== undefined) task.priority = req.body.priority;
    if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;
    if (req.body.completed !== undefined) task.completed = Boolean(req.body.completed);
    task.updatedAt = new Date().toISOString();

    tasks[taskIndex] = task;
    saveTasks(tasks);
    res.json(task);
  };

  app.put('/api/tasks/:id', updateHandler);
  app.patch('/api/tasks/:id', updateHandler);

  // DELETE /api/tasks/completed: Xóa tất cả tasks đã hoàn thành
  app.delete('/api/tasks/completed', (req, res) => {
    let tasks = getTasks();
    const initialCount = tasks.length;
    tasks = tasks.filter(t => !t.completed);
    saveTasks(tasks);
    res.json({ success: true, removedCount: initialCount - tasks.length });
  });

  // DELETE /api/tasks/:id: Xóa một task theo ID
  app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    let tasks = getTasks();
    const taskIndex = tasks.findIndex(t => String(t.id) === String(id));

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Không tìm thấy task với ID: ' + id });
    }

    tasks.splice(taskIndex, 1);
    saveTasks(tasks);
    res.json({ success: true, message: 'Đã xóa task thành công!', id });
  });

  app.listen(PORT, () => {
    console.log('====================================================');
    console.log('🚀 Task Tracker Server (Express) đang chạy!');
    console.log(`🌐 Website Dashboard: http://localhost:${PORT}`);
    console.log(`⚡ API Endpoint:     http://localhost:${PORT}/api/tasks`);
    console.log('====================================================');
  });
}

// Khởi động với HTTP Native nếu Express chưa được cài đặt
function startWithNativeHttp() {
  const http = require('http');
  const url = require('url');

  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Thiết lập CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (method === 'OPTIONS') {
      res.writeHead(200);
      return res.end();
    }

    // 1. Phục vụ trang chủ GET / hoặc /index.html
    if ((pathname === '/' || pathname === '/index.html') && method === 'GET') {
      fs.readFile(HTML_FILE, 'utf-8', (err, content) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end('Lỗi nạp file index.html: ' + err.message);
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    // 2. GET /api/tasks - Lấy danh sách tasks
    if (pathname === '/api/tasks' && method === 'GET') {
      const tasks = getTasks();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(tasks));
    }

    // Đọc body dữ liệu cho các phương thức POST, PUT, PATCH
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let parsedBody = {};
      if (body) {
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: 'Dữ liệu JSON không hợp lệ' }));
        }
      }

      // 3. POST /api/tasks - Thêm task mới
      if (pathname === '/api/tasks' && method === 'POST') {
        const { title, priority, dueDate } = parsedBody;
        if (!title || !title.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: 'Tiêu đề công việc không được để trống!' }));
        }

        const tasks = getTasks();
        const newTask = {
          id: 'task-' + Date.now(),
          title: title.trim(),
          priority: priority || 'medium',
          dueDate: dueDate || null,
          completed: false,
          createdAt: new Date().toISOString()
        };

        tasks.unshift(newTask);
        saveTasks(tasks);
        res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(newTask));
      }

      // 4. DELETE /api/tasks/completed - Xóa các việc đã xong
      if (pathname === '/api/tasks/completed' && method === 'DELETE') {
        let tasks = getTasks();
        const initialCount = tasks.length;
        tasks = tasks.filter(t => !t.completed);
        saveTasks(tasks);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ success: true, removedCount: initialCount - tasks.length }));
      }

      // 5. PUT / PATCH /api/tasks/:id - Cập nhật task
      const updateMatch = pathname.match(/^\/api\/tasks\/([^/]+)$/);
      if (updateMatch && (method === 'PUT' || method === 'PATCH')) {
        const id = updateMatch[1];
        const tasks = getTasks();
        const taskIndex = tasks.findIndex(t => String(t.id) === String(id));

        if (taskIndex === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: 'Không tìm thấy task với ID: ' + id }));
        }

        const task = tasks[taskIndex];
        if (parsedBody.title !== undefined) task.title = parsedBody.title.trim();
        if (parsedBody.priority !== undefined) task.priority = parsedBody.priority;
        if (parsedBody.dueDate !== undefined) task.dueDate = parsedBody.dueDate;
        if (parsedBody.completed !== undefined) task.completed = Boolean(parsedBody.completed);
        task.updatedAt = new Date().toISOString();

        tasks[taskIndex] = task;
        saveTasks(tasks);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(task));
      }

      // 6. DELETE /api/tasks/:id - Xóa task
      const deleteMatch = pathname.match(/^\/api\/tasks\/([^/]+)$/);
      if (deleteMatch && method === 'DELETE') {
        const id = deleteMatch[1];
        let tasks = getTasks();
        const taskIndex = tasks.findIndex(t => String(t.id) === String(id));

        if (taskIndex === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: 'Không tìm thấy task với ID: ' + id }));
        }

        tasks.splice(taskIndex, 1);
        saveTasks(tasks);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ success: true, message: 'Đã xóa task thành công!', id }));
      }

      // 7. Thử phục vụ static file nếu tồn tại
      const safeSuffix = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
      const potentialFile = path.join(__dirname, safeSuffix);
      if (fs.existsSync(potentialFile) && fs.statSync(potentialFile).isFile()) {
        const ext = path.extname(potentialFile).toLowerCase();
        const mimeTypes = {
          '.css': 'text/css; charset=utf-8',
          '.js': 'application/javascript; charset=utf-8',
          '.json': 'application/json; charset=utf-8',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.svg': 'image/svg+xml'
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        return fs.createReadStream(potentialFile).pipe(res);
      }

      // 8. Tuyến đường không tìm thấy
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Đường dẫn không tồn tại: ' + pathname }));
    });
  });

  server.listen(PORT, () => {
    console.log('====================================================');
    console.log('🚀 Task Tracker Server (Native HTTP) đang chạy!');
    console.log(`🌐 Website Dashboard: http://localhost:${PORT}`);
    console.log(`⚡ API Endpoint:     http://localhost:${PORT}/api/tasks`);
    console.log('💡 Gợi ý: Có thể cài thêm express bằng lệnh: npm install');
    console.log('====================================================');
  });
}

// Kiểm tra Express xem có thể nạp được không
try {
  require.resolve('express');
  startWithExpress();
} catch (e) {
  startWithNativeHttp();
}
