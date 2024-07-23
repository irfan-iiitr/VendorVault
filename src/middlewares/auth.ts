import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorised";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "../index";
import { RequestCustom } from "../types/express";

const authMiddleware = async(request: Request, res:Response, next:NextFunction) => {
    const  req = request as RequestCustom;
// 1. extract the token from header
const token = req.headers.authorization!
// 2. if token is not present, throw an error of unauthorized
if(!token) {
    next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
}
try {
// 3. if the token is present, verify that token and extract the payload
const payload = jwt.verify(token, JWT_SECRET) as any
// 4. to get the user from the payload
const user = await prismaClient.user.findFirst({where: {id: payload.userId}})
if (!user) {
    next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
}
// 5. to attach the user to the current request obejct
req.user = user as { id: number; email: string; name: string | null; password: string; createdAt: Date; updatedAt: Date; };
next()
}
catch(error) {
    next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
}


}

export default authMiddleware