export default {
	url: process.env.QUEUE_URL || 'amqp://localhost',
	limit: process.env.QUEUE_LIMIT || '100',
	prefetch: process.env.QUEUE_PREFETCH || '10',
};
