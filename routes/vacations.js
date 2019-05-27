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
        const [results] = await pool.execute('SELECT * FROM vacations');
        if (results.length) {
            res.send(results)
        } else {
            res
                .status(404)
                .send('there are no vacations in the database')
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
        const [results] = await pool.execute(`SELECT * FROM vacations WHERE id = ?`, [id]);
        if (results.length) {
            res.send(results[0]);
        } else {
            res
                .status(404)
                .send(`vacation ${id} doesnt exist`);
        }
    } catch (e) {
        res
            .status(500)
            .send('something has gone wrong!');
    }
});

router.post('/', async (req, res) => {
    const {description, destination, photo_url, start_date, end_date, price} = req.body;
    if (!description) {
        res
            .status(400)
            .send('expected vacation id in request');
    }
    const [results] = await pool.execute(`INSERT INTO vacations (
    vacations_description,
    destination,
    photo_url,
    start_date,
    end_date,
    price)
    VALUES (
    '${description}',
    '${destination}',
    '${photo_url}',
    '${start_date}',
    '${end_date}',
    '${price}')`);
    if (results.insertId) {
        res.send({id: results.insertId});
    } else {
        res
            .status(500)
            .send('something went wrong');
    }
});



router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const [results] = await pool.execute(`DELETE FROM vacations WHERE id = ?`, [id]);
    if (results.affectedRows) {
        res.status(200).send({ success: true });
    } else {
        res.status(404).send({ success: false });
    }
});

router.put('/:id',
    async (req, res) => {
        const {description, destination, photo_url, start_date, end_date, price} = req.body;
        const {id} = req.params;
        try {
            const [results] = await pool.execute(`UPDATE vacations SET vacations_description = '${description}' WHERE id = ?`, [id]);
            res.send(`vacation ${req.params.id} has been updated`);
        } catch (error) {
            console.log('error');
        }
    });


module.exports = router;