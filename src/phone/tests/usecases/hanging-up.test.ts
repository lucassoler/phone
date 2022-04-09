import { ChannelId, ChannelStates } from "../../domain/aggregates/entities/Channel";
import { Outcall } from "../../domain/aggregates/Outcall";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { CallAlreadyHungUpException } from "../../domain/exceptions/CallAlreadyHungUpException";
import { CallNotFoundException } from "../../domain/exceptions/CallNotFoundException";
import { CallRepositoryInMemory } from "../../infrastructure/repositories/callRepositoryInMemory";
import { FakeChannels } from "../../infrastructure/services/FakeChannels";
import { CallHangingUpCommandHandler, CallHangingUpCommand } from "../../usecases/commands/CallHangingUpCommandHandler";
import { An } from "../helpers/An";
import { DEFAULT_ID } from "../helpers/OutcallBuilder";

describe('Hanging up an outcall', () => {
    let repository: CallRepositoryInMemory;
    let channels: FakeChannels

    beforeEach(() => {
        channels = new FakeChannels()
        repository = new CallRepositoryInMemory(DEFAULT_ID, channels)
    })

    test('outcall does not exists', async () => {
        await expect(createHandler().handle(createCommand())).rejects.toThrow(new CallNotFoundException(CallId.from(DEFAULT_ID)));
    });


    test('outcall hanging up', async () => {
        const call = initCall();
        await createHandler().handle(createCommand());
        await verifyCallIsHungUp(call);
    });

    test('call was already hang up', async () => {
        const call = initCall(true);
        await expect(createHandler().handle(createCommand())).rejects.toThrowError(new CallAlreadyHungUpException(call.id));
    });

    test('hanging up an outcall should update customer channel state', async () => {
        const call = initCall();
        await createHandler().handle(createCommand());
        await verifyCustomerChannelStateIsHungUp(call.id);
    });

    test('hanging up an outcall should close customer channel', async () => {
        const call = initCall();
        await createHandler().handle(createCommand());
        verifyCustomerChannelHasBeenClosed(call.customer.channelId);
    });

    function verifyCustomerChannelHasBeenClosed(channelId: ChannelId) {
        expect(channels.closedChannels[0].channelId).toBe(channelId);
    }

    async function verifyCustomerChannelStateIsHungUp(callId: CallId) {
        const expectedCall = await repository.byId(callId);
        expect(expectedCall.customer!.state).toBe(ChannelStates.HungUp);
    }

    async function verifyCallIsHungUp(call: Outcall) {
        const expectedCall = await repository.byId(call.id);
        expect(expectedCall.isHangUp()).toBeTruthy();
    }

    function createHandler() {
        return new CallHangingUpCommandHandler(repository);
    }

    function createCommand() {
        return new CallHangingUpCommand(DEFAULT_ID);
    }

    function initCall(isHungUp : boolean = false) {
        const builder = An.Outcall();
        if (isHungUp) builder.hungUp();        
        const call = builder.build();
        repository.events.push(...call.uncommitedEvents);
        return call;
    }
});
