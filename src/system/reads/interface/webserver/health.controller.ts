import {NextFunction, Request, Response} from 'express';

export const healthController = () => {
    return async (request: Request, response: Response, next: NextFunction) => {
        response.status(200).json({});
    }
}
