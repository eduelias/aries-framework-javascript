import { Agent } from './agent/Agent';
import { InitConfig } from './agent/types';
import configManager from './config';
import logger from './logger';
import { StorageMessageSender } from './msgsender';
import bodyParser from 'body-parser';
import express from 'express';

export class RestAgency {
  public run(env: InitConfig): void {
    const config = configManager(env);
    const PORT = config.url.port;
    const app = express();

    const messageSender = new StorageMessageSender();
    const agent = new Agent(config, messageSender);

    app.use(bodyParser.text());
    app.set('json spaces', 2);

    app.get('/', async (req, res) => {
      const agentDid = agent.getAgentDid();
      res.send(agentDid);
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
