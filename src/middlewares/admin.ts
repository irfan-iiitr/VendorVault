import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorised";
import { ErrorCode } from "../exceptions/root";
import { RequestCustom } from "../types/express";

const adminMiddleware = async(request: Request, res:Response, next:NextFunction) => {
    const  req = request as RequestCustom;
    const user = req.user
    if(user.role == 'ADMIN') {
        next()
    }
    else {
        next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
    }


}

export default adminMiddleware