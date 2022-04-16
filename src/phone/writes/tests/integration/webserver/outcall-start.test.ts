import request from 'supertest';
import { ExpressServerHelper } from '../../../../../tests/integration/helpers/ExpressServerHelper';
import { IvrId } from '../../../domain/aggregates/entities/Ivr';
import { StartOutcallCommand, StartOutcallCommandHandler } from '../../../usecases/commands/StartOutcallCommandHandler';

const spy = StartOutcallCommandHandler.prototype.handle = jest.fn();

describe('REST - Outcall - Start', () => {
    let server = new ExpressServerHelper();

    afterAll(() => {
        server.stop();
    });

    test('start an outcall - 200', async () => {
        const res = await request(server.get()).post('/api/outcall').send({
            customer: "+33102030405",
            ivrId: "1"
        });

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
        expect(spy).toHaveBeenCalledWith(new StartOutcallCommand("+33102030405", new IvrId("1")));
    });
});