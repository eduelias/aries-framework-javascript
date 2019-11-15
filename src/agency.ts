import { Agent } from './agent/Agent';
import { InitConfig } from './agent/types';
import configManager from './config';
import logger from './logger';
import { StorageMessageSender } from './msgsender';
import bodyParser from 'body-parser';
import express from 'express';
import sodium from 'libsodium-wrappers';
import bs58 from 'bs58'
import { EventEmitter } from 'events';
import { IndyReq } from './ledger';

const gtxn = {
  "data": {
    "alias": "Node1",
    "blskey": "4N8aUNHSgjQVgkpm8nhNEfDf6txHznoYREg9kirmJrkivgL4oSEimFF6nsQ6M41QvhM2Z33nves5vfSn9n1UwNFJBYtWVnHYMATn76vLuL3zU88KyeAYcHfsih3He6UHcXDxcaecHVz6jhCYz1P2UZn2bDVruL5wXpehgBfBaLKm3Ba",
    "blskey_pop": "RahHYiCvoNCtPTrVtP7nMC5eTYrsUA8WjXbdhNc8debh1agE9bGiJxWBXYNFbnJXoXhWFMvyqhqhRoq737YQemH5ik9oL7R4NTTCz2LEZhkgLJzB3QRQqJyBNyv7acbdHrAT8nQ9UkLbaVL9NBpnWXBTw4LEMePaSHEw66RzPNdAX1",
    "client_ip": "127.0.0.1",
    "client_port": 9702,
    "node_ip": "127.0.0.1",
    "node_port": 9701,
    "services": [
      "VALIDATOR"
    ]
  },
  "dest": "Gw6pDLhcBcoQesN72qfotTgFa7cbuqZpkX3Xo6pLhPhv"
}

class MyError extends Error {
  public data: any;
}

function sign(serialized: string, signKey: string): string {
  const signature = sodium
    .crypto_sign(Buffer.from(serialized, 'utf8'), signKey)
    .slice(0, 64);
  return bs58.encode(Buffer.from(signature));
}

export class RestAgency {
  public api: any = new EventEmitter();
  private reqs: any = {};

  public run(env: InitConfig): void {
    const config = configManager(env);
    const PORT = config.url.port;
    const app = express();

    const messageSender = new StorageMessageSender();
    const agent = new Agent(config, messageSender);

    app.use(bodyParser.json());
    app.set('json spaces', 2);

    app.get('/', async (req, res) => {
      const agentDid = agent.getAgentDid();
      res.send(agentDid);
    });

    app.post('/nym', async (req, res) => {
      const ledger = IndyReq({ genesisTxn: JSON.stringify({ txn: { data: gtxn } }) });
      let resp;
      try {
        resp = await ledger.send(req.body);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      res.status(200).json(resp);
    });

    // Create new invitation as inviter to invitee
    app.get('/invitation', async (req, res) => {
      const invitationUrl = await agent.createInvitationUrl();
      res.send(invitationUrl);
    });

    app.post('/msg', async (req, res) => {
      const message = req.body;
      const packedMessage = JSON.parse(message);
      await agent.receiveMessage(packedMessage);
      res.status(200).end();
    });

    app.get('/api/connections/:verkey/message', async (req, res) => {
      const verkey = req.params.verkey;
      const message = messageSender.takeFirstMessage(verkey);
      res.send(message);
    });

    app.get('/api/connections/:verkey', async (req, res) => {
      // TODO This endpoint is for testing purpose only. Return agency connection by their verkey.
      const verkey = req.params.verkey;
      const connection = agent.findConnectionByTheirKey(verkey);
      res.send(connection);
    });

    app.get('/api/connections', async (req, res) => {
      // TODO This endpoint is for testing purpose only. Return agency connection by their verkey.
      const connections = agent.getConnections();
      res.json(connections);
    });

    app.get('/api/routes', async (req, res) => {
      // TODO This endpoint is for testing purpose only. Return agency connection by their verkey.
      const routes = agent.getRoutes();
      res.send(routes);
    });

    app.get('/api/messages', async (req, res) => {
      // TODO This endpoint is for testing purpose only.
      res.send(messageSender.messages);
    });

    app.get('/ssi', async (req, res) => {
      res.send({ message: `Here's a nice html to tell you that you're doing it wrong.` })
    })

    app.listen(PORT, async () => {
      await agent.init();
      await agent.setAgentDid();
      logger.log(`Application started on port ${PORT}`);
    });
  }
}
