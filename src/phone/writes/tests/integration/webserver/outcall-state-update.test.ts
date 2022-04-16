import request from 'supertest';
import { ExpressServerHelper } from '../../../../../tests/integration/helpers/ExpressServerHelper';
import { CallId } from '../../../domain/aggregates/value-objects/CallId';
import { AnswerChannelCommand, AnswerChannelCommandHandler } from '../../../usecases/commands/AnswerChannelCommandHandler';

let spy: jest.Mock;

describe('REST - Outcall - State Update', () => {
    let server = new ExpressServerHelper();

    beforeEach(() => {
        spy = AnswerChannelCommandHandler.prototype.handle = jest.fn();
    });

    afterAll(() => {
        server.stop();
    });

    test('channel answer - 200', async () => {
        const res = await request(server.get()).post('/api/outcall/status').send({
            CallStatus: "in-progress"
        });

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
        expect(spy).toHaveBeenCalledWith(new AnswerChannelCommand(CallId.from("1")));
    });

    test('states not recognized - 200', async () => {
        const res = await request(server.get()).post('/api/outcall/status').send({
            CallStatus: "invalid"
        });

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
        expect(spy).not.toBeCalled();
    });
});