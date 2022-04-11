import { ChannelAnswered } from "../../../domain/aggregates/events/ChannelAnswered";
import { CallId } from "../../../domain/aggregates/value-objects/CallId";
import { CallRepositoryInMemory } from "../../../infrastructure/repositories/callRepositoryInMemory";
import { IvrRepositoryInMemory } from "../../../infrastructure/repositories/IvrRepositoryInMemory";
import { FakeChannels } from "../../../infrastructure/services/FakeChannels";
import { StartIvrOnChannelAnsweredEventHandler } from "../../../usecases/events/StartIvrOnChannelAnsweredEventHandler";
import { An } from "../../helpers/builders/An";
import { DEFAULT_CHANNEL, DEFAULT_ID } from "../../helpers/builders/OutcallBuilder";

describe('Starting an ivr', () => {
    let repository: CallRepositoryInMemory;
    let channels: FakeChannels;
    let ivrRepository: IvrRepositoryInMemory;

    beforeEach(() => {
        channels = new FakeChannels();
        ivrRepository = new IvrRepositoryInMemory([An.Ivr().build()]);
        repository = new CallRepositoryInMemory(DEFAULT_ID, ivrRepository, channels);
        initCall();
    });

    test('should hang up call if there is no actions', async () => {
        prepareIvrWithoutActions();
        await createHandler().handle(createEvent());
        await verifyCallIsHungUp(DEFAULT_ID)
    });

    test('say "Hello" to customer', async () => {
        prepareIvrSaying("Hello");
        await createHandler().handle(createEvent());
        verifyMessageHasBennSaid([{ callId: DEFAULT_ID, message: "Hello" }]);
    });

    test('say "Welcome" to customer', async () => {
        prepareIvrSaying("Welcome");
        await createHandler().handle(createEvent());
        verifyMessageHasBennSaid([{ callId: DEFAULT_ID, message: "Welcome" }]);
    });

    async function verifyCallIsHungUp(callId: CallId) {
        const expectedCall = await repository.byId(callId);
        expect(expectedCall.isHangUp()).toBeTruthy();
    }

    function prepareIvrWithoutActions() {
        const ivr = An.Ivr()
            .withoutActions()
            .build();
        ivrRepository.ivrs = [ivr];
    }

    function prepareIvrSaying(message: string) {
        const ivr = An.Ivr()
            .resetActions()
            .withAction(
                An.IvrAction()
                    .saying(message)
                    .build())
            .build();
        ivrRepository.ivrs = [ivr];
    }

    function createHandler() {
        return new StartIvrOnChannelAnsweredEventHandler(repository);
    }

    function createEvent() {
        return new ChannelAnswered(DEFAULT_ID, DEFAULT_CHANNEL);
    }

    function initCall() {
        const builder = An.Outcall();
        builder.answered();
        const call = builder.build();
        repository.events = call.uncommitedEvents;
    }

    function verifyMessageHasBennSaid(messages: { callId: CallId; message: string; }[]) {
        expect(channels.says).toStrictEqual(messages);
    }
});

