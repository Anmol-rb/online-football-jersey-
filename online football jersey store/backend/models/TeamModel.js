const { db } = require('../config/db');

class TeamModel {
    // Get all teams
    async getAll() {
        const sql = 'SELECT * FROM teams ORDER BY name';
        const [rows] = await db.query(sql);
        return rows;
    }

    // Get team by ID
    async getById(id) {
        const sql = 'SELECT * FROM teams WHERE id = ?';
        const [rows] = await db.query(sql, [id]);
        return rows[0] || null;
    }

    // Create team
    async create(teamData) {
        const { name, country_code, flag } = teamData;
        const sql = 'INSERT INTO teams (name, country_code, flag) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [name, country_code, flag]);
        return result.insertId;
    }

    // Update team
    async update(id, teamData) {
        const { name, country_code, flag } = teamData;
        const sql = 'UPDATE teams SET name = ?, country_code = ?, flag = ? WHERE id = ?';
        const [result] = await db.query(sql, [name, country_code, flag, id]);
        return result.affectedRows > 0;
    }

    // Delete team
    async delete(id) {
        const sql = 'DELETE FROM teams WHERE id = ?';
        const [result] = await db.query(sql, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new TeamModel();