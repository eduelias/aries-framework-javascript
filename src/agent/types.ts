export interface InitConfig {
  url: URL;
  label: string;
  walletName: string;
  walletKey: string;
  publicDid: Did;
  publicDidSeed: string;
  agencyVerkey?: Verkey;
}

export enum ConnectionState {
  INIT,
  INVITED,
  REQUESTED,
  RESPONDED,
  COMPLETE,
}

export interface Connection {
  did: Did;
  didDoc: DidDoc;
  verkey: Verkey;
  theirDid?: Did;
  theirKey?: Verkey;
  theirDidDoc?: any;
  invitation?: InvitationDetails;
  state: ConnectionState;
  endpoint?: string;
  messages: any[];
}

export interface InvitationDetails {
  label: string;
  recipientKeys: Verkey[];
  serviceEndpoint: string;
  routingKeys: Verkey[];
}

export interface DidDoc {
  '@context': string;
  service: Service[];
}

interface Service {
  serviceEndpoint: string;
  recipientKeys: Verkey[];
  routingKeys: Verkey[];
}

export interface Message {
  '@id': string;
  '@type': string;
  [key: string]: any;
}

export interface InboundMessage {
  message: Message;
  sender_verkey: Verkey; // TODO make it optional
  recipient_verkey: Verkey; // TODO make it optional
}

export interface OutboundMessage {
  connection: Connection;
  endpoint?: string;
  payload: Message;
  recipientKeys: Verkey[];
  routingKeys: Verkey[];
  senderVk: Verkey | null;
}

export interface Agency {
  verkey: Verkey;
  connection: Connection;
}
