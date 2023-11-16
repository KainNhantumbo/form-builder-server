import swaggerUI from 'swagger-ui-express';
import { sequelize } from '../config/data-source';
import swaggerSpec from '../docs/swagger.json';
import ErrorHandler from '../lib/error-handler';
import EventLogger from '../lib/event-logger';
import { _404Route } from '../routes/error-404.routes';
import { AppProps, CurrentServer, IReq, IRes } from '../types';

export default class CreateServer {
  private readonly props: AppProps;

  constructor(props: AppProps) {
    this.props = props;
    this.start();
  }

  private async start() {
    try {
      await sequelize.authenticate();
      const serverInstance = this.props.app.listen(this.props.port, () => {
        EventLogger.info('Connected to Database.');
        EventLogger.info(`Server Online: ${this.props.port}`);
        this.serveDocs();

        this.props.app.use(_404Route);
        this.props.app.use(ErrorHandler.handler);
      });
      this.shutdown(serverInstance);
    } catch (error) {
      console.error(error);
      process.exit(process.exitCode || 0);
    }
  }

  private async shutdown(server: CurrentServer) {
    const signals = ['SIGINT', 'SIGTERM'];

    try {
      await sequelize.close();
      for (const signal of signals) {
        process.on(signal, () => {
          EventLogger.info(`${signal} received: closing HTTP server.`);
          server.close(() => {
            EventLogger.info('Cleanup finished, server is shutting down.');
          });
        });
      }
    } catch (error) {
      console.error(error);
      process.exit(process.exitCode || 1);
    }
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
