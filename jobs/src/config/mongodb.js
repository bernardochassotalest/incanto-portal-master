export default {
    url: process.env.MONGODB_URL,
    options: {
        reconnectTries: process.env.MONGODB_RECONNECT_TRIES || Number.MAX_VALUE,
        reconnectInterval: process.env.MONGODB_RECONNECT_INTERVAL || 1000,
        socketTimeoutMS: process.env.MONGODB_TIMEOUT || 0,
        poolSize: process.env.MONGODB_POOL_SIZE || 5,
        keepAlive: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
};
