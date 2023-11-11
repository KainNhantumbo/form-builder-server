import { debug } from 'node:util';
import { info } from 'node:console';
import terminus from '@godaddy/terminus';
import swaggerSpec from '../swagger.json';
import swaggerUI from 'swagger-ui-express';
import EventLogger from '../lib/event-logger';
import { sequelize } from '../config/data-source';
import { AppProps, IReq, IRes } from '../types';

export default class CreateServer {
  private readonly props: AppProps;

  constructor(props: AppProps) {
    this.props = props;
    this.start();
  }

  private async start() {
    try {
      await sequelize.authenticate();
      this.props.app.listen(this.props.port, () => {
        EventLogger.info('Connected to Database.');
        EventLogger.info(`Server Online: ${this.props.port}`);
        this.serveDocs()


      });
      this.shutdown();
    } catch (error) {
      console.error(error);
      process.exit(process.exitCode || 0);
    }
  }

  private shutdown() {
    return terminus.createTerminus(this.props.app, {
      onSignal: async function () {
        try {
          await sequelize.close();
        } catch (error) {
          console.error(error);
        }
      },
      beforeShutdown: async function () {
        debug('Signal received: closing HTTP server.');
      },
      onShutdown: async function () {
        info('Cleanup finished, server is shutting down.');
      },
      timeout: 15000,
      signals: ['SIGINT', 'SIGTERM']
    });
  }

  private serveDocs() {
    this.props.app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

    this.props.app.get('/docs-json', (req: IReq, res: IRes) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    EventLogger.info(
      `API Documentation: http://localhost:${this.props.port}/docs`
    );
  }
}
