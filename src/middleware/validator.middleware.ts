import { IReq, IRes, INext } from '../types';
import { LoginSchema } from '../schemas/login';

export default class Validator {
  static async login(req: IReq, res: IRes, next: INext) {
    LoginSchema.parse({ body: req.body });
    next();
  }
}
