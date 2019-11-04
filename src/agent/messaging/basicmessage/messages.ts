import { MessageType } from '../messagetype';
import uuid from 'uuid/v4';


export function createBasicMessage(content: string) {
  return {
    '@id': uuid(),
    '@type': MessageType.BasicMessage,
    '~l10n': { locale: 'en' },
    sent_time: new Date().toISOString(),
    content,
  };
}
