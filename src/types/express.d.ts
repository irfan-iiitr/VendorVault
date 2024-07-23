import { User } from '@prisma/client';
import { Request } from 'express';


export interface RequestCustom extends Request
{
    user: User;
}

// declare namespace Express {
//     interface Request {
//       user: User;
//     }
//   }