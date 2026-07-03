const { db } = require('../config/db');

class OrderModel {
    async create(userId, items, total) {
        const sql = 'INSERT INTO orders (user_id, items, total) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [userId, JSON.stringify(items), total]);
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
        const sql = 'SELECT * FROM orders ORDER BY created_at DESC';
        const [rows] = await db.query(sql);
        return rows;
    }

    async updateStatus(orderId, status) {
        const sql = 'UPDATE orders SET status = ? WHERE id = ?';
        const [result] = await db.query(sql, [status, orderId]);
        return result.affectedRows > 0;
    }
}

module.exports = new OrderModel();