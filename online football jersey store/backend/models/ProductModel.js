const { db } = require('../config/db');

class ProductModel {
    // Get all products
    async getAll() {
        const sql = 'SELECT * FROM products ORDER BY id DESC';
        const [rows] = await db.query(sql);
        return rows;
    }

    // Get product by ID
    async getById(id) {
        const sql = 'SELECT * FROM products WHERE id = ?';
        const [rows] = await db.query(sql, [id]);
        return rows[0] || null;
    }

    // Search products
    async search(keyword) {
        const sql = `
            SELECT * FROM products 
            WHERE name LIKE ? OR player LIKE ? OR team LIKE ?
        `;
        const searchTerm = `%${keyword}%`;
        const [rows] = await db.query(sql, [searchTerm, searchTerm, searchTerm]);
        return rows;
    }

    // ============ ADMIN METHODS ============

    // Create product
    async create(productData) {
        const { name, price, team, player, sizes, image, badge, stock } = productData;
        const sql = `
            INSERT INTO products (name, price, team, player, sizes, image, badge, stock)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [
            name, 
            price, 
            team, 
            player, 
            JSON.stringify(sizes), 
            image, 
            badge, 
            stock
        ]);
        return result.insertId;
    }

    // Update product
    async update(id, productData) {
        const { name, price, team, player, sizes, image, badge, stock } = productData;
        const sql = `
            UPDATE products 
            SET name = ?, price = ?, team = ?, player = ?, sizes = ?, image = ?, badge = ?, stock = ?
            WHERE id = ?
        `;
        const [result] = await db.query(sql, [
            name, 
            price, 
            team, 
            player, 
            JSON.stringify(sizes), 
            image, 
            badge, 
            stock, 
            id
        ]);
        return result.affectedRows > 0;
    }

    // Delete product
    async delete(id) {
        const sql = 'DELETE FROM products WHERE id = ?';
        const [result] = await db.query(sql, [id]);
        return result.affectedRows > 0;
    }

    // Update stock
    async updateStock(id, quantity) {
        const sql = 'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?';
        const [result] = await db.query(sql, [quantity, id, quantity]);
        return result.affectedRows > 0;
    }
}

module.exports = new ProductModel();