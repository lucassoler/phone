import { EventPublisher, InternalEventPublisher } from "../../../../common/EventPublisher";
import { ChannelStates } from "../../domain/aggregates/entities/Channel";
import { IvrState } from "../../domain/aggregates/entities/Ivr";
import { ChannelAnswered } from "../../domain/aggregates/events/ChannelAnswered";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { CallStates } from "../../domain/aggregates/value-objects/CallStates";
import { CallAlreadyHungUpException } from "../../domain/exceptions/CallAlreadyHungUpException";
import { CallNotFoundException } from "../../domain/exceptions/CallNotFoundException";
import { ChannelAlreadyAnsweredException } from "../../domain/exceptions/ChannelAlreadyAnsweredException";
import { InvalidOutcallStateForAction } from "../../domain/exceptions/InvalidOutcallStateForAction";
import { CallRepositoryInMemory } from "../../infrastructure/repositories/callRepositoryInMemory";
import { IvrRepositoryInMemory } from "../../infrastructure/repositories/IvrRepositoryInMemory";
import { FakeChannels } from "../../infrastructure/services/FakeChannels";
import { AnswerChannelCommand, AnswerChannelCommandHandler } from "../../usecases/commands/AnswerChannelCommandHandler";
import { StartIvrOnChannelAnsweredEventHandler } from "../../usecases/events/StartIvrOnChannelAnsweredEventHandler";
import { An } from "../helpers/builders/An";
import { DEFAULT_ID, DEFAULT_CHANNEL_ID } from "../helpers/builders/OutcallBuilder";

describe('customer channel answer', () => {
    let repository: CallRepositoryInMemory;
    let channels: FakeChannels;
    let ivrRepository: IvrRepositoryInMemory;
    let eventPublisher: EventPublisher;

    beforeEach(() => {
        channels = new FakeChannels();
        ivrRepository = new IvrRepositoryInMemory([An.Ivr().build()]);
        repository = new CallRepositoryInMemory(DEFAULT_ID, ivrRepository, channels);
        eventPublisher = new InternalEventPublisher();
        eventPublisher.registerHandlers({[ChannelAnswered.name]: new StartIvrOnChannelAnsweredEventHandler(repository)})
        initCall();
    });

    test('should set call state to answered', async () => {
        await createHandler().handle(createCommand());
        await verifyCallStateIsAnswered();
    });

    test('should start ivr', async () => {
        await createHandler().handle(createCommand());
        await verifyIvrHasBeenStarted();
    });
    
    describe('throw an error', () => {
        test('on a non-existing outcall', async () => {
            removeCalls();
            await expect(createHandler().handle(createCommand())).rejects.toThrowError(new CallNotFoundException(DEFAULT_ID));
        });
    
        test('on a already hung up outcall', async () => {
            initCall(true);
            await expect(createHandler().handle(createCommand())).rejects.toThrowError(new InvalidOutcallStateForAction());
        });
    
        test('on a already answered outcall', async () => {
            initCall(false, true);
            await expect(createHandler().handle(createCommand())).rejects.toThrowError(new InvalidOutcallStateForAction());
        });
    });

    async function verifyIvrHasBeenStarted() {
        const expectedCall = await repository.byId(DEFAULT_ID);
        expect(expectedCall.ivr.state).toBe(IvrState.Started);
    }

    async function verifyCallStateIsAnswered(callId: CallId = DEFAULT_ID) {
        const expectedCall = await repository.byId(callId);
        expect(expectedCall.state).toBe(CallStates.Answered);
    }

    function createHandler() {
        return new AnswerChannelCommandHandler(repository, eventPublisher);
    }

    function createCommand(callId: CallId = DEFAULT_ID) {
        return new AnswerChannelCommand(callId);
    }

    function removeCalls() {
        repository.events = [];
    }

    function initCall(isHungUp = false, answered = false) {
        const builder = An.Outcall();
        if (isHungUp) builder.hungUp();  
        if (answered) builder.answered();      
        const call = builder.build();
        repository.events = call.uncommitedEvents;
    }
});