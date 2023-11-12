import { IReq, IRes, INext } from '../types';
import { LoginSchema } from '../schemas/login.schema';
import { SignupSchema } from '../schemas/signup.schema';
import { FormSchema } from '../schemas/form.schema';

export default class Validator {
  static async login(req: IReq, res: IRes, next: INext) {
    LoginSchema.parse({ body: req.body });
    next();
  }

  static async signup(req: IReq, res: IRes, next: INext) {
    SignupSchema.parse({ body: req.body });
    next();
  }
  
  static async form(req: IReq, res: IRes, next: INext) {
    FormSchema.parse({ body: req.body });
    next();
  }
}
