import _ from 'lodash'
import amqp from "amqplib";
import debug from "debug";
import rabbitConfig from 'config/rabbit';

const BUFFER_SIZE = 100;
const BUFFER_TIMEOUT = 2000;

class Broker {
	constructor(url) {
		this.url = url;
    this.channels = {};
    this.bufferQueue = {};
    this.timer = setInterval(() => this.checkBuffer(), BUFFER_TIMEOUT);
		this.logger = debug("incanto:broker");
	}

	async connect() {
		const conn = await amqp.connect(this.url);
		return await conn.createChannel();
	}

  disconnect() {
    clearInterval(this.timer)
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

  createBufferItem() {
    return { startAt: (new Date()).getTime(), content: [] }
  }

  async checkBuffer() {
    let now = (new Date()).getTime();
    for (let queue in this.bufferQueue) {
      let current = this.bufferQueue[queue];
      if (((now - current.startAt) > BUFFER_TIMEOUT) && (_.size(current.content) > 0)) {
        await this.publish(queue, current.content);
        this.bufferQueue[queue] = this.createBufferItem();
      }
    }
  }

  async publishBuffer(queue, message) {
    let current = this.bufferQueue[queue];
    if (!current) {
      this.bufferQueue[queue] = this.createBufferItem();
      current = this.bufferQueue[queue];
    }
    current.content.push(message)
    if (_.size(current.content) >= BUFFER_SIZE) {
      await this.publish(queue, current.content);
      this.bufferQueue[queue] = this.createBufferItem();
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
			await channel.assertQueue(queue, { durable: true, limit: Number(rabbitConfig.limit || 1) });
			await channel.prefetch(Number(rabbitConfig.prefetch || 1));
			await channel.consume(queue, this.prepareCallback(channel.ack.bind(channel), callback), { noAck: false, });
		} catch (error) {
			this.logger(`subscribe: ${error}`);
			throw error;
		}
	}
}

const instance = (url) => new Broker(url);

export { instance };
