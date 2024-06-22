const keys = require("./keys")

// Express Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PG SETUP
const { Pool } = require("pg");

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
    ssl: false
        // process.env.NODE_ENV !== 'production'
        //     ? false
        //     : { rejectUnauthorized: false },
});

// pgClient.on("error", () => {
//     console.log("PG connection lost");
// })

pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS PG_VALUES (index INT, value INT)")
        .catch((err) => console.error(err));
});


// REDIS client setup
const redis = require("redis")

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000 // Tells redis to connect after every 1000ms in connection failed.
});

const redisPublisher = redisClient.duplicate();

// Express Routes Handlers
app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from PG_VALUES');
    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('redis_values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }

    redisClient.hset('redis_values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query("INSERT INTO PG_VALUES (index, value) values($1, $2)", [index, -999]);
    res.send({ working: true });
});

app.listen(5000, err => {
    console.log("Listening to port 5000");
})