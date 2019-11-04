import { MessageType } from '../messagetype';
import uuid from 'uuid/v4';


export function createRouteUpdateMessage(recipientKey: Verkey) {
  return {
    '@id': uuid(),
    '@type': MessageType.RouteUpdateMessage,
    updates: [
      {
        recipient_key: recipientKey,
        action: 'add', // "add" or "remove"
      },
    ],
  };
}

export function createForwardMessage(to: Verkey, msg: any) {
  const forwardMessage = {
    '@type': MessageType.ForwardMessage,
    to,
    msg,
  };
  return forwardMessage;
}
