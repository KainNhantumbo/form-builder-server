import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import User from '../models/User';
import AppError from '../lib/app-error';
import { validatePasswords } from '../lib/password-validator';
import { Request as IReq, Response as IRes } from 'express';

dotenv.config(); // imports env variables

export default class UserController {
  async getUser(req: IReq, res: IRes) {
    const { user } = req.body;
    const foundUser = await User.findOne({
      where: { id: user.id },
      select: { last_session: false, password: false }
    });

    if (!foundUser)
      throw new AppError('Requested user account was not found.', 404);
    res.status(200).json(foundUser);
  }

  async createUser(req: IReq, res: IRes) {
    const { password, email, ...data } = req.body;

    // check for duplicates
    const existingUser = await User.findOne({
      where: { email },
      select: { id: true }
    });

    if (existingUser?.id)
      throw new AppError('A account with provided email already exists.', 409);

    await User.create({ ...data, password, email });
    res.sendStatus(201);
  }

  async updateUser(req: IReq, res: IRes) {
    let { user, ...userData } = req.body;
    const { password, ...data } = userData;

    const updatedDoc = await User.update({ id: user.id }, { ...data });
    if (!updatedDoc.affected)
      throw new AppError('Error: failed to update data', 403);
    res.status(200).json({ ...updatedDoc });
  }

  async deleteUser(req: IReq, res: IRes) {
    let { user } = req.body;

    const deletedDoc = await User.delete({ id: user.id });
    if (!deletedDoc.affected)
      throw new AppError(
        'Failed to delete your account. Please, try again later.',
        400
      );
    res.sendStatus(204);
  }
}
