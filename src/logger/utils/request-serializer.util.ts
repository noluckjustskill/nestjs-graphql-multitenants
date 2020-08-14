import { Request } from 'express';

export const requestSerializer = (req: Request) => {
  // TODO: http serializer
  return { id: req.id };
};
