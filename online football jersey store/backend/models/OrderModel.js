const { db } = require('../config/db');

class OrderModel {
    // Create order with payment status
    async create(userId, items, total, paymentStatus = 'Pending') {
        const sql = 'INSERT INTO orders (user_id, items, total, payment_status) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [userId, JSON.stringify(items), total, paymentStatus]);
        return result.insertId;
    }

    async getByUser(userId) {
        const sql = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
        const [rows] = await db.query(sql, [userId]);
        return rows;
    }

    async getById(orderId) {
        const sql = 'SELECT * FROM orders WHERE id = ?';
        const [rows] = await db.query(sql, [orderId]);
        return rows[0] || null;
    }

    async getAll() {
        const sql = `
            SELECT o.*, u.fullName, u.email 
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `;
        const [rows] = await db.query(sql);
        return rows;
    }

    async updateStatus(orderId, status) {
        const sql = 'UPDATE orders SET status = ? WHERE id = ?';
        const [result] = await db.query(sql, [status, orderId]);
        return result.affectedRows > 0;
    }

    async updatePaymentStatus(orderId, paymentStatus) {
        const sql = 'UPDATE orders SET payment_status = ? WHERE id = ?';
        const [result] = await db.query(sql, [paymentStatus, orderId]);
        return result.affectedRows > 0;
    }

    async getStats() {
        const sql = `
            SELECT 
                COUNT(*) as totalOrders,
                SUM(total) as totalRevenue,
                AVG(total) as averageOrderValue,
                COUNT(DISTINCT user_id) as totalCustomers,
                SUM(CASE WHEN payment_status = 'Paid' THEN 1 ELSE 0 END) as paidOrders,
                SUM(CASE WHEN payment_status = 'Pending' THEN 1 ELSE 0 END) as pendingOrders
            FROM orders
        `;
        const [rows] = await db.query(sql);
        return rows[0] || {};
    }

    async delete(orderId) {
        const sql = 'DELETE FROM orders WHERE id = ?';
        const [result] = await db.query(sql, [orderId]);
        return result.affectedRows > 0;
    }
}

module.exports = new OrderModel();