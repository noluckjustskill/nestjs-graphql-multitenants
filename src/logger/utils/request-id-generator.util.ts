import { Request } from 'express';
import { v4 as uuidV4 } from 'uuid';

export const requestIdGenerator = (req: Request) => req.headers.requestid || uuidV4();
