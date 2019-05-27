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
        const [results] = await pool.execute('SELECT * FROM users');
        if (results.length) {
            res.send(results)
        } else {
            res
                .status(404)
                .send('there are no users in the database')
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
        const [results] = await pool.execute(`SELECT * FROM users WHERE user_id = ?`, [id]);
        if (results.length) {
            res.send(results[0]);
        } else {
            res
                .status(404)
                .send(`user ${id} doesn't exist`);
        }
    } catch (e) {
        res
            .status(500)
            .send('something has gone wrong!');
    }
});

router.post('/', async (req, res) => {
    const {user_id, is_admin,first_name,last_name,password,user_name} = req.body;
    if (!user_id) {
        res
            .status(400)
            .send('expected user id in request');
    }
    const [results] = await pool.execute(`INSERT INTO users (
    user_id,
    is_admin,
    first_name,
    last_name,
    password,
    user_name) 
    VALUES (
    '${user_id}',
    '${is_admin}',
    '${first_name}',
    '${last_name}',
    '${password}',
    '${user_name}')`);
    if (results.insertId) {
        res.send({id: results.insertId});
    } else {
        res
            .status(500)
            .send('something went wrong');
    }
});



module.exports = router;