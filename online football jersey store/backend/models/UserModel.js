const { db } = require('../config/db');

class UserModel {
    async create(userData) {
        const { fullName, email, password, dob, gender, phone, address, city, country } = userData;
        const sql = `
            INSERT INTO users (fullName, email, password, dob, gender, phone, address, city, country)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [fullName, email, password, dob, gender, phone, address, city, country]);
        return result.insertId;
    }

    async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.query(sql, [email]);
        return rows[0] || null;
    }

    async findById(id) {
        const sql = 'SELECT id, fullName, email, dob, gender, phone, address, city, country, role, created_at FROM users WHERE id = ?';
        const [rows] = await db.query(sql, [id]);
        return rows[0] || null;
    }

    async update(id, userData) {
        const { fullName, phone, address, city, country } = userData;
        const sql = `
            UPDATE users 
            SET fullName = ?, phone = ?, address = ?, city = ?, country = ?
            WHERE id = ?
        `;
        const [result] = await db.query(sql, [fullName, phone, address, city, country, id]);
        return result.affectedRows > 0;
    }

    async findAll() {
    const sql = `
        SELECT id, fullName, email, role, created_at 
        FROM users 
        ORDER BY created_at DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
}
}

module.exports = new UserModel();