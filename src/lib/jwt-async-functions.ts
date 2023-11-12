import * as jwt from 'jsonwebtoken';
import { DecodedPayload } from '../types';

/**
 * @param user_id user id string
 * @param secret jwt secret key
 * @param exp time to token expire
 * @returns Promise<unknown>
 */
export function createToken(
  data: object,
  secret: string,
  exp: string | number
) {
  return new Promise((resolve): void => {
    const token = jwt.sign({ ...data }, secret, {
      expiresIn: exp
    });
    resolve(token);
  });
}

/**
 * An asynchronous function to verify integrity of the token.
 * @param token string
 * @param secret string
 * @returns Promise<unknown>
 */
export function verifyToken(token: string, secret: string) {
  return new Promise<DecodedPayload>((resolve): void => {
    const result = jwt.verify(token, secret) as DecodedPayload
    resolve(result);
  });
}
