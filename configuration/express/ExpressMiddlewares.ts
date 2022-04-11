import { NextFunction, Request, Response } from "express";

export class ExpressMiddlewares {
    static configureServices() {
        return (request: Request, response: Response, next: NextFunction): void => {
            next();
        }
    }

    static prepareResponseHeader() {
        return (request: Request, response: Response, next: NextFunction): void => {
            response.header("Access-Control-Allow-Credentials", "true");
            next();
        }
    }
}