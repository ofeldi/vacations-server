const mysql = require('mysql2/promise');
var express = require('express');
var router = express.Router();

let pool;
(async function initializePool() {
    pool = await mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'vacations',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
})();

/* GET users listing. */
router.get('/', async (req, res) => {
    try {
        const [results] = await pool.execute('SELECT * FROM followers');
        if (results.length) {
            res.send(results)
        } else {
            res
                .status(404)
                .send('there are no followers in the database')
        }
    } catch (e) {
        res
            .status(500)
            .send('something has gone wrong!')
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const [results] = await pool.execute(`SELECT * FROM followers WHERE id = ?`, [id]);
        if (results.length) {
            res.send(results[0]);
        } else {
            res
                .status(404)
                .send(`follower ${id} doesnt exist`);
        }
    } catch (e) {
        res
            .status(500)
            .send('something has gone wrong!');
    }
});

module.exports = router;