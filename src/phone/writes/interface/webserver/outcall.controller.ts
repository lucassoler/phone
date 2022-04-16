import {Request, Response} from 'express';
import { Dependencies } from '../../../../../configuration/services/serviceLocator';
import { IvrId } from '../../domain/aggregates/entities/Ivr';
import { CallId } from '../../domain/aggregates/value-objects/CallId';
import { AnswerChannelCommand } from '../../usecases/commands/AnswerChannelCommandHandler';
import { StartOutcallCommand } from '../../usecases/commands/StartOutcallCommandHandler';

export const outcallStartController = (services: Dependencies) => {
    return async (request: Request, response: Response) => {
        await services.commandDispatcher.dispatch(new StartOutcallCommand(request.body.customer, new IvrId('1')));
        response.status(200).json({});
    }
}

export const outCallStateUpdateController = (services: Dependencies) => {
    return async (request: Request, response: Response) => {
        response.status(200).json({});
        if (request.body.CallStatus == 'in-progress') {
            await services.commandDispatcher.dispatch(new AnswerChannelCommand(CallId.from('1')));
        }
    }
}
