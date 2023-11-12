import { z } from 'zod';
import * as dotenv from 'dotenv';
import { IReq, IRes } from '../types';
import User from '../models/user.model';
import AppError from '../lib/app-error';
import { sequelize } from '../config/data-source';
import { hashPassword, validatePasswords } from '../lib/password-utils';

dotenv.config(); // imports env variables

export default class UserController {
  async getUser(req: IReq, res: IRes) {
    const { user } = req.body;
    const result = await sequelize.transaction(async (t) => {
      return await User.findOne({
        where: { id: user.id },
        attributes: { exclude: ['last_session', 'password'] }
      });
    });

    if (!result)
      throw new AppError('Requested user account was not found.', 404);
    res.status(200).json(result);
  }

  async createUser(req: IReq, res: IRes) {
    const { password, email, ...data } = req.body;

    const { status: isValidEmail } = await z
      .string()
      .email()
      ._parseAsync(email);

    if (isValidEmail !== 'valid')
      throw new AppError('Please verify your email.', 400);

    const { success, message } = await validatePasswords(password);

    if (!success) throw new AppError(String(message), 400);

    // check for duplicates
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser)
      throw new AppError('A account with provided email already exists.', 409);

    const hash = await hashPassword(password);

    await sequelize.transaction(async (t) => {
      await User.create({ ...data, password: hash, email });
    });
    res.sendStatus(201);
  }

  async updateUser(req: IReq, res: IRes) {
    const { user, password, ...data } = req.body;

    if (password) {
      const { success, message } = await validatePasswords(password);

      if (!success) throw new AppError(String(message), 400);
      data.password = await hashPassword(password);
    }

    const result = await sequelize.transaction(async (t) => {
      return await User.update(
        { ...data },
        { where: { id: user.id }, transaction: t }
      );
    });

    res.status(200).json({ ...result });
  }

  async deleteUser(req: IReq, res: IRes) {
    const { user } = req.body;

    const result = await sequelize.transaction(async (t) => {
      return await User.destroy({
        where: { id: user.id },
        transaction: t,
        cascade: true
      });
    });

    if (result < 1)
      throw new AppError(
        'Failed to delete your account. Please try again later.',
        400
      );
    res.sendStatus(204);
  }
}
