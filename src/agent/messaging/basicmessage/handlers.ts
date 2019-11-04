import { InboundMessage } from '../../types';
import { ConnectionService } from '../connections/ConnectionService';
import { createAckMessage } from '../connections/messages';
import { createOutboundMessage } from '../helpers';
import { Context } from '../interface';

export function handleBasicMessage(connectionService: ConnectionService) {
  return async (inboundMessage: InboundMessage, context: Context) => {
    const { message, recipient_verkey, sender_verkey } = inboundMessage;
    const connection = connectionService.findByVerkey(recipient_verkey);

    if (!connection) {
      throw new Error(`Connection for verkey ${recipient_verkey} not found!`);
    }

    if (!connection.theirKey) {
      throw new Error(`Connection with verkey ${connection.verkey} has no recipient keys.`);
    }

    connection.messages.push(message);

    const response = createAckMessage(message['@id']);

    return createOutboundMessage(connection, response);
  };
}
