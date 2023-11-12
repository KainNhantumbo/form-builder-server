import * as dotenv from 'dotenv';
import AppError from '../lib/app-error';
import User, { IUser } from '../models/User';
import { Request as IReq, Response as IRes } from 'express';
import { verifyToken, createToken } from '../lib/jwt-async-functions';
import { sequelize } from '../config/data-source';
import { comparePasswords } from '../lib/password-utils';

dotenv.config(); // imports env variables

export default class AuthController {
  async defaultLogin(req: IReq, res: IRes) {
    const PROD_ENV: boolean =
      process.env.NODE_ENV === 'development' ? false : true;

    const { password, email } = req.body;

    const user = (await sequelize.transaction(async (t) => {
      return await User.findOne({ where: { email }, transaction: t });
    })) as unknown as IUser | null;

    if (!user) throw new AppError('Account not found.', 404);

    const match = await comparePasswords(password, user.password);

    if (!match)
      throw new AppError('Wrong password. Please check and try again.', 403);

    // updates the user session time
    await sequelize.transaction(async (t) => {
      await User.update(
        { last_session: new Date().toISOString() },
        { where: { id: user.id }, transaction: t }
      );
    });

    if (!process.env.ACCESS_TOKEN || !process.env.REFRESH_TOKEN)
      throw new AppError('Cannot generate token keys.', 500);

    if (!process.env.ACCESS_TOKEN_EXPDATE || !process.env.REFRESH_TOKEN_EXPDATE)
      throw new AppError('Cannot generate token expiration time.', 500);

    const accessToken = await createToken(
      { id: String(user.id) },
      process.env.ACCESS_TOKEN,
      process.env.ACCESS_TOKEN_EXPDATE
    );
    const refreshToken = await createToken(
      { id: String(user.id) },
      process.env.REFRESH_TOKEN,
      process.env.REFRESH_TOKEN_EXPDATE
    );

    res
      .status(200)
      .cookie('userToken', refreshToken, {
        httpOnly: true,
        secure: PROD_ENV && true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      })
      .json({
        id: String(user.id),
        token: accessToken,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`
      });
  }

  async refresh(req: IReq, res: IRes) {
    const token = req.cookies.userToken;
    if (!token) throw new AppError('Access denied: invalid credentials.', 401);

    const decodedPayload = await verifyToken(
      token,
      process.env.REFRESH_TOKEN || ''
    );

    if (!decodedPayload) throw new AppError('Access denied: forbidden.', 403);

    const user = await sequelize.transaction(async (t) => {
      return await User.findOne({
        where: { id: decodedPayload.id },
        transaction: t
      });
    }) as unknown as IUser | null

    if (!user) throw new AppError('Access denied: invalid credentials', 401);

    if (!process.env.ACCESS_TOKEN)
      throw new AppError('Server error: cannot access server token keys.', 500);

    if (!process.env.ACCESS_TOKEN_EXPDATE)
      throw new AppError(
        'Server error: cannot access server default token expiration time.',
        500
      );

    const accessToken = await createToken(
      { id: String(user.id) },
      process.env.ACCESS_TOKEN,
      process.env.ACCESS_TOKEN_EXPDATE
    );

    res.status(200).json({
      id: String(user.id),
      token: accessToken,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`
    });
  }

  async logout(req: IReq, res: IRes) {
    const token = req.cookies.userToken;
    const PROD_ENV = process.env.NODE_ENV === 'development' ? false : true;
    if (!token) throw new AppError('Access denied: invalid credentials.', 401);
    res
      .status(204)
      .clearCookie('userToken', {
        httpOnly: true,
        secure: PROD_ENV && true,
        sameSite: 'strict'
      })
      .json({ message: 'Logout successful.' });
  }
}
