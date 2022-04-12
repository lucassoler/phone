import {Request, Response} from 'express';
import { Dependencies } from '../../../../../configuration/services/serviceLocator';
import { IvrId } from '../../domain/aggregates/entities/Ivr';
import { StartOutcallCommand } from '../../usecases/commands/StartOutcallCommandHandler';

export const outcallStartController = (services: Dependencies) => {
    return async (request: Request, response: Response) => {
        await services.commandDispatcher.dispatch(new StartOutcallCommand(request.body.customer, new IvrId('1')));
        response.status(200).json({});
    }
}
