export default () => ({
	url: process.env.MONGODB_URL,
	options: {
		socketTimeoutMS: process.env.MONGODB_TIMEOUT || 0,
		poolSize: process.env.MONGODB_POOL_SIZE || 5,
		keepAlive: true,
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	},
});
