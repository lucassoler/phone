import { FakePhoneNumberFactory } from "../../infrastructure/factories/fakePhoneNumberFactory";
import { CallRepositoryInMemory } from "../../infrastructure/repositories/callRepositoryInMemory";
import { FakeUuidGenerator } from "../../infrastructure/services/FakeUuidGenerator";
import { DEFAULT_CHANNEL_ID, DEFAULT_CUSTOMER, DEFAULT_ID } from "../helpers/OutcallBuilder";
import { StartOutcallCommand, StartOutcallCommandHandler } from "../../usecases/commands/StartOutcallCommandHandler";
import { ChannelId, ChannelStates } from "../../domain/aggregates/entities/Channel";
import { FakeChannels } from "../../infrastructure/services/FakeChannels";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { CallStates } from "../../domain/aggregates/value-objects/CallStates";

describe('start an outcall', () => {
    let phoneNumberFactory: FakePhoneNumberFactory;
    let uuidGenerator: FakeUuidGenerator;
    let repository: CallRepositoryInMemory;
    let channels: FakeChannels

    beforeEach(() => {
        phoneNumberFactory = new FakePhoneNumberFactory();
        uuidGenerator = new FakeUuidGenerator();
        channels = new FakeChannels()
        repository = new CallRepositoryInMemory(DEFAULT_ID, channels);
        uuidGenerator.next(DEFAULT_CHANNEL_ID);
    });

    test('start an outcall', async () => {
        await createHandler().handle(createCommand());
        await verifyOutcallStarted(CallId.from(DEFAULT_ID));
    });

    test('start an outcall should originate customer channel', async () => {
        await createHandler().handle(createCommand());
        verifyCustomerChannelHasBeenOriginated(ChannelId.from(DEFAULT_CHANNEL_ID));
    });

    function verifyCustomerChannelHasBeenOriginated(channelId: ChannelId) {
        expect(channels.originatedChannels[0].channelId).toStrictEqual(channelId);
        expect(channels.originatedChannels[0].state).toStrictEqual(ChannelStates.Originated);
    }

    async function verifyOutcallStarted(callId: CallId) {
        const callPersisted = await repository.byId(callId);
        expect(callPersisted.id).toStrictEqual(callId);
        expect(callPersisted.state).toStrictEqual(CallStates.Init);
        expect(callPersisted.customerState()).toStrictEqual(ChannelStates.Originated);
    }

    function createHandler() {
        return new StartOutcallCommandHandler(phoneNumberFactory, uuidGenerator, repository, channels);
    }

    function createCommand() {
        return new StartOutcallCommand(DEFAULT_CUSTOMER);
    }
});