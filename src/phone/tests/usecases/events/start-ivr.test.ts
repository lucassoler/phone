import { EventPublisher, InternalEventPublisher } from "../../../../common/EventPublisher";
import { ChannelAnswered } from "../../../domain/aggregates/events/ChannelAnswered";
import { CallId } from "../../../domain/aggregates/value-objects/CallId";
import { CallRepositoryInMemory } from "../../../infrastructure/repositories/callRepositoryInMemory";
import { IvrRepositoryInMemory } from "../../../infrastructure/repositories/IvrRepositoryInMemory";
import { FakeChannels } from "../../../infrastructure/services/FakeChannels";
import { StartIvrOnChannelAnsweredEventHandler } from "../../../usecases/events/StartIvrOnChannelAnsweredEventHandler";
import { An } from "../../helpers/An";
import { DEFAULT_CHANNEL, DEFAULT_ID } from "../../helpers/OutcallBuilder";

describe('Starting an ivr', () => {
    let repository: CallRepositoryInMemory;
    let channels: FakeChannels;
    let ivrRepository: IvrRepositoryInMemory;
    let eventPublisher: EventPublisher;

    beforeEach(() => {
        channels = new FakeChannels();
        ivrRepository = new IvrRepositoryInMemory([An.Ivr().build()]);
        repository = new CallRepositoryInMemory(DEFAULT_ID, ivrRepository, channels);
        eventPublisher = new InternalEventPublisher();
        eventPublisher.registerHandlers({ [ChannelAnswered.name]: new StartIvrOnChannelAnsweredEventHandler(repository) })
        initCall();
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

    function prepareIvrSaying(message: string) {
        const ivr = An.Ivr()
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

