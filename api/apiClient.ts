/**
 * هذا الملف هو نقطة البداية لتحديد كيفية تواصل الواجهة الأمامية مع الخادم.
 * عند بناء الواجهة الخلفية، سيتم استبدال كل استدعاءات localStorage باستدعاءات API من هنا.
 * 
 * This file is the starting point for defining how the frontend communicates with the backend.
 * When building the backend, all localStorage calls will be replaced by API calls from here.
 */

// في مشروع حقيقي، ستستخدم مكتبة مثل 'axios' لتسهيل طلبات HTTP.
// In a real project, you would use a library like 'axios' for easier HTTP requests.
// import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // مثال على عنوان الخادم المحلي

/**
 * مثال على دالة لجلب بيانات المستخدم الحالي من الخادم.
 * ستحتاج إلى تمرير توكن المصادقة (JWT).
 * 
 * Example function to fetch the current user's data from the server.
 * You would need to pass an authentication token (JWT).
 */
export const getCurrentUser = async (token: string) => {
    /*
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        // إذا فشل الطلب، تعامل مع الخطأ هنا
        // (مثلاً، إذا انتهت صلاحية التوكن، قم بتسجيل خروج المستخدم)
        throw new Error('Failed to fetch user data');
    }

    return response.json();
    */

    // بيانات مؤقتة لأغراض العرض والتطوير
    console.log("Fetching user with token:", token);
    return Promise.resolve({ 
        name: "Placeholder User", 
        email: "user@example.com",
        points: 1000,
        jewels: 50
    });
};

/**
 * مثال على دالة لتسجيل الدخول.
 * @returns {Promise<{token: string}>}
 */
export const loginUser = async (credentials: { email?: string, phone?: string, password?: string }) => {
    /*
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    if (!response.ok) {
        throw new Error('Login failed');
    }
    return response.json(); // should return { token: "..." }
    */
    console.log("Logging in with:", credentials);
    return Promise.resolve({ token: "fake-jwt-token" });
}

// يمكنك إضافة المزيد من دوال الـ API هنا، مثل:
// - registerUser
// - buyCounter
// - activateCounter
// - giftCounter
// - createChatRoom
// - fetchMessagesForRoom