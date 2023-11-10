import { debug } from 'node:util';
import { info } from 'node:console';
import { DataSource } from 'typeorm';
import terminus from '@godaddy/terminus';
import type { AppProps } from '../types';
import Database, { AppDataSource } from '../config/data-source';

export default class CreateServer {
  private readonly props: AppProps;
  private database: DataSource = AppDataSource;

  constructor(props: AppProps) {
    this.props = props;
    this.start();
  }

  private async start() {
    try {
      this.database = await Database.connect();
      this.props.app.listen(this.props.port, () => {
        info(`Server running... Port: ${this.props.port}`);
      });
      this.shutdown();
    } catch (error) {
      console.error(error);
      process.exit(process.exitCode || 0);
    }
  }

  private shutdown() {
    const databaseInstance = this.database;
    return terminus.createTerminus(this.props.app, {
      onSignal: async function () {
        try {
          await databaseInstance.destroy();
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
}
