# 9. دليل تكامل الواجهة الخلفية (Backend Integration)

هذا الدليل الشامل مصمم لمساعدتك على نقل هذا المشروع من تطبيق يعمل من جانب العميل فقط إلى تطبيق كامل (Full-Stack) مع خادم حقيقي وقاعدة بيانات.

## 1. لماذا نحتاج إلى واجهة خلفية؟

- **الأمان**: لحماية منطق اللعبة ومنع الغش، وتخزين بيانات المستخدمين بشكل آمن.
- **مصدر الحقيقة الوحيد**: لضمان أن جميع المستخدمين يرون نفس البيانات المحدثة، بغض النظر عن الجهاز الذي يستخدمونه.
- **الميزات المتقدمة**: لتمكين ميزات مثل الدردشة في الوقت الفعلي، والإشعارات الحية، ولوحات المتصدرين.

## 2. اختيار حزمة التقنيات (Tech Stack)

نقترح حزمة تقنيات شائعة تعتمد على JavaScript، مما يسهل الانتقال للمطورين الذين يعرفون React.

- **بيئة التشغيل (Runtime)**: **Node.js** - تسمح بتشغيل JavaScript على الخادم.
- **إطار العمل (Framework)**: **Express.js** - إطار عمل بسيط ومرن لبناء تطبيقات الويب و APIs على Node.js.
- **قاعدة البيانات (Database)**: **MongoDB** - قاعدة بيانات NoSQL مرنة وشائعة، تعمل بشكل جيد مع JavaScript.
  - **ODM (Object Data Modeling)**: **Mongoose** - مكتبة تسهل التعامل مع MongoDB من خلال تعريف نماذج (Schemas) للبيانات.
- **الوقت الفعلي (Real-time)**: **Socket.IO** - مكتبة لجعل الاتصال بين العميل والخادم في الوقت الفعلي (للدردشة) سهلاً.
- **المصادقة (Authentication)**: **JSON Web Tokens (JWT)** - معيار آمن لتبادل المعلومات بين الطرفين.

## 3. خطوات بناء الواجهة الخلفية

### الخطوة 1: إعداد المشروع والخادم الأساسي

1.  **أنشئ مجلدًا جديدًا** بجانب مجلد الواجهة الأمامية (مثلاً، `bazar-ali-baba-backend`).
2.  **ابدأ مشروع Node.js**: `npm init -y`
3.  **ثبّت المكتبات الأساسية**:
    ```bash
    npm install express cors dotenv mongoose bcryptjs jsonwebtoken
    npm install --save-dev nodemon
    ```
4.  **أنشئ ملف الخادم الرئيسي (`server.js` أو `index.js`)**:

    ```javascript
    // server.js
    require('dotenv').config();
    const express = require('express');
    const cors = require('cors');
    // const connectDB = require('./config/db'); // سيتم إنشاؤه لاحقًا

    const app = express();

    // تفعيل CORS للسماح للواجهة الأمامية بالاتصال
    app.use(cors()); 
    // للسماح للخادم بقراءة JSON من الطلبات
    app.use(express.json());

    // connectDB(); // الاتصال بقاعدة البيانات

    app.get('/', (req, res) => res.send('API is running...'));

    // تعريف مسارات الـ API هنا لاحقًا
    // app.use('/api/auth', require('./routes/authRoutes'));
    // app.use('/api/users', require('./routes/userRoutes'));

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    ```

### الخطوة 2: الاتصال بقاعدة البيانات (MongoDB)

1.  **أنشئ حسابًا** على [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) للحصول على قاعدة بيانات مجانية.
2.  **احصل على سلسلة الاتصال (Connection String)**.
3.  **أضفها إلى ملف `.env`**:
    ```
    MONGO_URI=mongodb+srv://<user>:<password>@cluster...
    ```
4.  **أنشئ ملف الاتصال (`config/db.js`)**:
    ```javascript
    // config/db.js
    const mongoose = require('mongoose');

    const connectDB = async () => {
      try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
    };
    module.exports = connectDB;
    ```

### الخطوة 3: بناء نماذج البيانات وواجهات الـ API

ستحتاج إلى إنشاء "نماذج" (Models) لكل نوع من البيانات (User, Room, Message) و "مسارات" (Routes) لتحديد نقاط نهاية الـ API.

**مثال: مصادقة المستخدم**

- **نموذج المستخدم (`models/User.js`)**:
  ```javascript
  const mongoose = require('mongoose');
  
  const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    // ... أضف حقول أخرى مثل points, jewels, etc.
  });
  module.exports = mongoose.model('User', UserSchema);
  ```

- **مسارات المصادقة (`routes/authRoutes.js`)**:
  ```javascript
  const express = require('express');
  const router = express.Router();
  // ... استيراد bcrypt, jwt, و User model

  // @route   POST api/auth/register
  // @desc    Register a user
  router.post('/register', async (req, res) => {
    // 1. تحقق مما إذا كان المستخدم موجودًا بالفعل.
    // 2. قم بتجزئة كلمة المرور باستخدام bcrypt.
    // 3. أنشئ مستخدمًا جديدًا في قاعدة البيانات.
    // 4. أنشئ JWT.
    // 5. أعد الـ JWT إلى العميل.
  });

  // @route   POST api/auth/login
  // @desc    Authenticate user & get token
  router.post('/login', async (req, res) => {
    // 1. ابحث عن المستخدم في قاعدة البيانات.
    // 2. قارن كلمة المرور المدخلة بالهاش المخزن باستخدام bcrypt.
    // 3. إذا تطابقت، أنشئ وأعد JWT.
  });

  module.exports = router;
  ```

### الخطوة 4: تنفيذ الدردشة الحية مع Socket.IO

1.  **ثبّت المكتبة**: `npm install socket.io`
2.  **اربط Socket.IO بخادم Express**:

    ```javascript
    // في server.js
    const http = require('http');
    const { Server } = require("socket.io");
    
    const server = http.createServer(app); // استخدم الخادم الجديد
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000", // رابط الواجهة الأمامية
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected:', socket.id);

        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on('send_message', (data) => {
            // هنا، احفظ الرسالة في قاعدة البيانات أولاً
            // ثم أرسلها إلى جميع المستخدمين في الغرفة
            socket.to(data.roomId).emit('receive_message', data);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
    
    // استبدل app.listen بـ server.listen
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    ```

## 4. تعديل الواجهة الأمامية

1.  **إنشاء طبقة API**: في مجلد `api/`، قم بإنشاء دوال لكل طلب API.

    ```typescript
    // api/apiClient.ts
    import axios from 'axios';
    const apiClient = axios.create({ baseURL: 'http://localhost:3001/api' });

    export const login = (email, password) => apiClient.post('/auth/login', { email, password });
    export const register = (userData) => apiClient.post('/auth/register', userData);
    // ...
    ```

2.  **استبدال `localStorage`**: في `App.tsx` والمكونات الأخرى، استبدل `useLocalStorage` باستدعاءات API (ويفضل استخدام React Query).
3.  **دمج Socket.IO Client**:
    - **ثبّت المكتبة**: `npm install socket.io-client`
    - **أنشئ اتصالاً**:
      ```typescript
      // في مكان مناسب، ربما في سياق React Context
      import io from 'socket.io-client';
      const socket = io('http://localhost:3001');
      ```
    - **استمع وأرسل الأحداث**: في مكون `RoomView.tsx`، استخدم `socket.emit` لإرسال الرسائل و `socket.on` لاستقبالها.

## 5. متطلبات الأداء (Performance Considerations)

عند الانتقال إلى بنية حقيقية، يصبح الأداء عاملاً حاسماً.

- **قاعدة البيانات**:
  - **الفهرسة (Indexing)**: تأكد من إضافة فهارس للحقول التي يتم البحث فيها بشكل متكرر (مثل `email` للمستخدمين، `roomId` للرسائل) لتسريع عمليات الاستعلام.
  - **الاستعلامات الفعالة**: تجنب جلب بيانات غير ضرورية. استخدم `projection` في MongoDB لتحديد الحقول التي تحتاجها فقط.
- **الخادم (API)**:
  - **الاستجابات المقتضبة**: لا ترسل كائنات ضخمة. أرسل فقط البيانات التي تحتاجها الواجهة الأمامية.
  - **التخزين المؤقت (Caching)**: للبيانات التي لا تتغير كثيرًا، يمكن استخدام استراتيجيات التخزين المؤقت (مثل Redis) لتقليل الحمل على قاعدة البيانات.
  - **الـ Pagination**: للوائح الطويلة (مثل سجل الرسائل أو قائمة المستخدمين)، قم دائمًا بتنفيذ الـ pagination لجلب البيانات على شكل أجزاء صغيرة.
- **الشبكة**:
  - **تقليل حجم الـ Payload**: استخدم ضغط GZIP على الخادم.
  - **استخدام HTTP/2**: يتيح تعدد الطلبات على اتصال واحد، مما يحسن الأداء.

## 6. النشر (Deployment)

عندما يصبح تطبيقك جاهزًا، ستحتاج إلى نشره.

- **الواجهة الأمامية (Frontend)**: يمكن نشرها كـ "موقع ثابت" (Static Site) على منصات مثل **Vercel**, **Netlify**, أو **AWS S3/CloudFront**.
- **الواجهة الخلفية (Backend)**: يمكن نشرها على منصات مثل **Heroku**, **Render**, **AWS EC2/Elastic Beanstalk**, أو **Google Cloud**.
- **قاعدة البيانات**: استخدم خدمة مُدارة مثل **MongoDB Atlas** لسهولة الإدارة والنسخ الاحتياطي.