import amqp from "amqplib";
import debug from "debug";

class Broker {
	constructor(url) {
		this.url = url;
    this.channels = {};
		this.logger = debug("incanto:broker");
	}

	async connect() {
		const conn = await amqp.connect(this.url);
		return await conn.createChannel();
	}

  async getChannel(type) {
    let channel = this.channels[type];
    if (!channel) {
      channel = await this.connect();
      this.channels[type] = channel;
    }
    return channel;
  };

	async publish(queue, message) {
		try {
			const channel = await this.getChannel('sender');
			await channel.assertQueue(queue, { durable: true });
			channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
		} catch (error) {
			this.logger(`publish: ${error}`);
			throw error;
		}
	}

	prepareCallback = (ack, callback) => ({ fields, properties, content }) => {
		let parsed = String(content);
		try {
			callback({ fields, properties, content: JSON.parse(parsed), ack });
		} catch (error) {
			callback({ fields, properties, content: parsed, ack });
		}
	};

	async subscribe(queue, callback) {
		try {
			const channel = await this.getChannel('receiver');
			await channel.assertQueue(queue, { durable: true, limit: Number(process.env.QUEUE_LIMIT|| 1) });
			await channel.prefetch(Number(process.env.QUEUE_PREFETCH || 1));
			await channel.consume(queue, this.prepareCallback(channel.ack.bind(channel), callback), { noAck: false, });
		} catch (error) {
			this.logger(`subscribe: ${error}`);
			throw error;
		}
	}
}

const instance = (url) => new Broker(url);

export { instance };
