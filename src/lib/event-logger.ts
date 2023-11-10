import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { appendFile, mkdir } from 'node:fs/promises';
import type { LoggerProps, IRes, IReq, INext } from '../types';

export default class EventLogger {
  private readonly date: string = new Date().toISOString();
  private readonly fileName: string;
  private readonly message: string;

  constructor(props: LoggerProps) {
    this.fileName = props.fileName;
    this.message = props.message;
  }

  public async register() {
    const LOG = `${this.date}\t${randomUUID()}\t${this.message}\n\n\n`;
    try {
      if (!existsSync(join(__dirname, '..', 'logs'))) {
        await mkdir(join(__dirname, '..', 'logs'));
      }
      await appendFile(join(__dirname, '..', 'logs', this.fileName), LOG);
    } catch (err) {
      console.error(err);
    }
  }

  public logger(req: IReq, res: IRes, next: INext) {
    this.register();
    console.info(`${req.method}\t${req.path}\t${req.url} `);
    next();
  }

  static info(message: string) {
    console.info(`[${new Date().toLocaleDateString()}]\t\t`, message);
  }
}