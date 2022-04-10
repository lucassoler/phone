import { FakePhoneNumberFactory } from "../../infrastructure/factories/fakePhoneNumberFactory";
import { CallRepositoryInMemory } from "../../infrastructure/repositories/callRepositoryInMemory";
import { DEFAULT_CHANNEL_ID, DEFAULT_CUSTOMER, DEFAULT_ID } from "../helpers/OutcallBuilder";
import { StartOutcallCommand, StartOutcallCommandHandler } from "../../usecases/commands/StartOutcallCommandHandler";
import { ChannelId, ChannelStates } from "../../domain/aggregates/entities/Channel";
import { FakeChannels } from "../../infrastructure/services/FakeChannels";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { CallStates } from "../../domain/aggregates/value-objects/CallStates";
import { InvalidPhoneNumber } from "../../domain/exceptions/InvalidPhoneNumber";
import { IvrRepositoryInMemory } from "../../infrastructure/repositories/IvrRepositoryInMemory";
import { An } from "../helpers/An";
import { DEFAULT_IVR_ID } from "../helpers/IvrBuilder";
import { IvrNotFound } from "../../domain/exceptions/IvrNotFound";

describe('start an outcall', () => {
    let phoneNumberFactory: FakePhoneNumberFactory;
    let repository: CallRepositoryInMemory;
    let channels: FakeChannels;
    let ivrRepository: IvrRepositoryInMemory;

    beforeEach(() => {
        phoneNumberFactory = new FakePhoneNumberFactory();
        channels = new FakeChannels();
        ivrRepository = new IvrRepositoryInMemory([An.Ivr().build()]);
        repository = new CallRepositoryInMemory(DEFAULT_ID, ivrRepository, channels);
    });

    test('should persist an outcall', async () => {
        await createHandler().handle(createCommand());
        await verifyOutcallStarted(DEFAULT_ID);
    });

    test('should create a customer channel with the same id as the outcall', async () => {
        await createHandler().handle(createCommand());
        await verifyCustomerChannelId(DEFAULT_ID);
    });

    test('should originate customer channel', async () => {
        await createHandler().handle(createCommand());
        verifyCustomerChannelHasBeenOriginated(DEFAULT_CHANNEL_ID);
    });

    test('should load an irv', async () => {
        await createHandler().handle(createCommand());
        const callPersisted = await repository.byId(DEFAULT_ID);
        expect(callPersisted.ivr.id).toStrictEqual(DEFAULT_IVR_ID);
    });

    describe('throw an error', () => {
        test('with an invalid phone number', async () => {
            phoneNumberFactory.throwError(new InvalidPhoneNumber("+00"));
            await expect(createHandler().handle(createCommand("+00"))).rejects.toThrowError(new InvalidPhoneNumber("+00"));
            verifyChannelHasBeenHungUpOnError();
        });
    
        test('with an invalid ivrId', async () => {
            await expect(createHandler().handle(createCommand(DEFAULT_CUSTOMER, "not_found"))).rejects.toThrowError(new IvrNotFound("not_found"));
            verifyChannelHasBeenHungUpOnError();
        });
    });


    function verifyChannelHasBeenHungUpOnError() {
        expect(channels.closedChannels[0]).toStrictEqual(DEFAULT_CHANNEL_ID);
    }

    function verifyCustomerChannelId(callId: CallId) {
        expect(channels.originatedChannels[0].channelId.id).toStrictEqual(callId.id);
    }

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
        return new StartOutcallCommandHandler(phoneNumberFactory, repository, channels, ivrRepository);
    }

    function createCommand(phoneNumber: string = DEFAULT_CUSTOMER, ivrId: string = "1") {
        return new StartOutcallCommand(phoneNumber, ivrId);
    }
});