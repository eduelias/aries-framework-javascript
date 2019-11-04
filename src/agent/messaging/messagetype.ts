export enum MessageType {
  ConnectionInvitation = 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/didexchange/1.0/invitation',
  ConnectionRequest = 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/didexchange/1.0/request',
  ConnectionResposne = 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/didexchange/1.0/response',
  Ack = 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/notification/1.0/ack',
  RouteUpdateMessage = 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/routecoordination/1.0/keylist_update',
  ForwardMessage = 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/routing/1.0/forward',
  BasicMessage = 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/basicmessage/1.0/message',
}