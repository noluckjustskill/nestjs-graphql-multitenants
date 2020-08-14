import { Algorithm } from 'jsonwebtoken';

export interface ITokenOptions {
  algorithm: Algorithm;
  expiresIn: number;
}
