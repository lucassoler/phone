import { NextFunction, Request, Response } from "express";
import { Dependencies } from "../services/serviceLocator";

export class ExpressMiddlewares {
    static configureServices(dependencies: Dependencies) {
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