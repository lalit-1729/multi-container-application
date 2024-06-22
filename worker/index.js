const keys = require("./keys")

const redis = require("redis");

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000 // Tells redis to connect after every 1000ms in connection failed.
});

const sub = redisClient.duplicate();

function computeFibonacciSequence(index) {
    if (index < 2) return 1;
    return computeFibonacciSequence(index - 1) + computeFibonacciSequence(index - 2);
}

sub.on("message", (channel, message) => {
    redisClient.hset('redis_values', message, computeFibonacciSequence(parseInt(message)));
});

sub.subscribe('insert');