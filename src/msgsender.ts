import { OutboundMessage } from './agent/types';
import logger from './logger';
export class StorageMessageSender {
  messages: {
    [key: string]: any;
  } = {};
  async sendMessage(message: OutboundMessage, outboundMessage?: OutboundMessage) {
    const connection = outboundMessage && outboundMessage.connection;
    if (!connection) {
      throw new Error(`Missing connection. I don't know how and where to send the message.`);
    }
    if (!connection.theirKey) {
      throw new Error('Trying to save message without theirKey!');
    }
    if (!this.messages[connection.theirKey]) {
      this.messages[connection.theirKey] = [];
    }
    logger.logJson('Storing message', { connection, message });
    this.messages[connection.theirKey].push(message);
  }
  takeFirstMessage(verkey: Verkey) {
    if (this.messages[verkey]) {
      return this.messages[verkey].shift();
    }
    return null;
  }
}
