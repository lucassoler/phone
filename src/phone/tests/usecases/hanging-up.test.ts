import { ChannelId, ChannelStates } from "../../domain/aggregates/entities/Channel";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { CallAlreadyHungUpException } from "../../domain/exceptions/CallAlreadyHungUpException";
import { CallNotFoundException } from "../../domain/exceptions/CallNotFoundException";
import { CallRepositoryInMemory } from "../../infrastructure/repositories/callRepositoryInMemory";
import { IvrRepositoryInMemory } from "../../infrastructure/repositories/IvrRepositoryInMemory";
import { FakeChannels } from "../../infrastructure/services/FakeChannels";
import { CallHangingUpCommandHandler, CallHangingUpCommand } from "../../usecases/commands/CallHangingUpCommandHandler";
import { An } from "../helpers/An";
import { DEFAULT_CHANNEL_ID, DEFAULT_ID } from "../helpers/OutcallBuilder";

describe('Hanging up an outcall', () => {
    let repository: CallRepositoryInMemory;
    let channels: FakeChannels
    let ivrRepository: IvrRepositoryInMemory;

    beforeEach(() => {
        channels = new FakeChannels();
        ivrRepository = new IvrRepositoryInMemory([An.Ivr().build()]);
        repository = new CallRepositoryInMemory(DEFAULT_ID, ivrRepository, channels);
        initCall();
    })


    test('should persist outcall state', async () => {
        await createHandler().handle(createCommand());
        await verifyCallIsHungUp(DEFAULT_ID);
    });

    test('should update customer channel state to hung up', async () => {
        await createHandler().handle(createCommand());
        await verifyCustomerChannelStateIsHungUp(DEFAULT_ID);
    });

    test('hanging up an outcall should close customer channel', async () => {
        await createHandler().handle(createCommand());
        verifyCustomerChannelHasBeenClosed(DEFAULT_CHANNEL_ID);
    });

    describe('throw an error', () => {
        test('on an non-existing outcall', async () => {
            removeCalls();
            await expect(createHandler().handle(createCommand())).rejects.toThrow(new CallNotFoundException(DEFAULT_ID));
        });

        test('on an outcall already hung up', async () => {
            initCall(true);
            await expect(createHandler().handle(createCommand())).rejects.toThrowError(new CallAlreadyHungUpException(DEFAULT_ID));
        });
    });

    function verifyCustomerChannelHasBeenClosed(channelId: ChannelId) {
        expect(channels.closedChannels[0]).toStrictEqual(channelId);
    }

    async function verifyCustomerChannelStateIsHungUp(callId: CallId) {
        const expectedCall = await repository.byId(callId);
        expect(expectedCall.customer!.state).toBe(ChannelStates.HungUp);
    }

    async function verifyCallIsHungUp(callId: CallId) {
        const expectedCall = await repository.byId(callId);
        expect(expectedCall.isHangUp()).toBeTruthy();
    }

    function createHandler() {
        return new CallHangingUpCommandHandler(repository);
    }

    function createCommand() {
        return new CallHangingUpCommand(DEFAULT_ID.id);
    }

    function removeCalls() {
        repository.events = [];
    }

    function initCall(isHungUp : boolean = false) {
        const builder = An.Outcall();
        if (isHungUp) builder.hungUp();        
        const call = builder.build();
        repository.events = call.uncommitedEvents;
    }
});
