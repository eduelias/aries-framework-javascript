import { Connection, InvitationDetails } from '../../types';
import { MessageType } from '../messagetype';
import uuid from 'uuid/v4';

export async function createInvitationMessage({
  label,
  serviceEndpoint,
  recipientKeys,
  routingKeys,
}: InvitationDetails) {
  return {
    '@type': MessageType.ConnectionInvitation,
    '@id': uuid(),
    label,
    recipientKeys,
    serviceEndpoint,
    routingKeys,
  };
}

export function createConnectionRequestMessage(connection: Connection, label: string) {
  return {
    '@type': MessageType.ConnectionRequest,
    '@id': uuid(),
    label: label,
    connection: {
      did: connection.did,
      did_doc: connection.didDoc,
    },
  };
}

export function createConnectionResponseMessage(connection: Connection, thid: string) {
  return {
    '@type': MessageType.ConnectionResposne,
    '@id': uuid(),
    '~thread': {
      thid,
    },
    connection: {
      did: connection.did,
      did_doc: connection.didDoc,
    },
  };
}

export function createAckMessage(thid: string) {
  return {
    '@type': MessageType.Ack,
    '@id': uuid(),
    status: 'OK',
    '~thread': {
      thid: thid,
    },
  };
}
