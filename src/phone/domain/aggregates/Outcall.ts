import { CallAlreadyHungUpException } from "../exceptions/CallAlreadyHungUpException";
import { ChannelAlreadyAnsweredException } from "../exceptions/ChannelAlreadyAnsweredException";
import { IvrRepository } from "../repositories/IvrRepository";
import { Channels } from "../services/Channels";
import { Channel, ChannelStates } from "./entities/Channel";
import { Ivr, IvrState } from "./entities/Ivr";
import { ChannelAnswered } from "./events/ChannelAnswered";
import { ChannelHungUp } from "./events/ChannelHungUp";
import { ChannelOriginated } from "./events/ChannelOriginated";
import { IvrStarted } from "./events/IvrStarted";
import { OutcallEnded } from "./events/OutcallEnded";
import { OutcallEvent } from "./events/OutcallEvent";
import { OutcallStarted } from "./events/OutcallStarted";
import { CallId } from "./value-objects/CallId";
import { CallStates } from "./value-objects/CallStates";

export class Outcall {
    customer: Channel;
    id: CallId;
    state: CallStates = CallStates.Init;
    uncommitedEvents: Array<OutcallEvent> = new Array();
    ivr: Ivr;
    private events: Array<OutcallEvent> = new Array();

    private constructor(id: CallId, customer: Channel, ivr: Ivr, private readonly channels: Channels) {
        this.id = id;
        this.customer = customer;
        this.ivr = ivr;
    }

    static from(id: CallId, customer: Channel, ivr: Ivr, channels: Channels)
    {
        const call = new Outcall(id, customer, ivr, channels);
        call.init();
        return call;
    } 

    static async rehydrate(events: OutcallEvent[], ivrRepository: IvrRepository, channels: Channels): Promise<Outcall> {
        const startedEvent = events.find(x => x instanceof OutcallStarted) as OutcallStarted;
        const ivr = await ivrRepository.load(startedEvent.ivrId.id);
        const call = new Outcall(startedEvent.id, startedEvent.customer, ivr, channels);
        call.applyEvents(events);
        return call;
    }

    init() {
        const event = new OutcallStarted(this.id, this.ivr.id, this.customer);
        this.applyOutcallStartedEvent(event);
        this.uncommitedEvents.push(event);
    }

    applyEvents(events: OutcallEvent[]) {
        events.forEach((event) => {
            if (event instanceof OutcallStarted) {
                this.applyOutcallStartedEvent(event);
            } else if (event instanceof ChannelOriginated) {
                this.applyChannelOriginatedEvent(event);
            } else if (event instanceof OutcallEnded) {
                this.applyOutcallEndedEvent(event);
            } else if (event instanceof ChannelHungUp) {
                this.applyChannelHungUpEvent(event);
            } else if (event instanceof ChannelAnswered) {
                this.applyChannelAnsweredEvent(event);
            } else if (event instanceof IvrStarted) {
                this.applyIvrStartedEvent(event);
            }
        });
        this.events = events;
    }

    applyOutcallStartedEvent(event: OutcallStarted) {
        this.customer = Channel.from(event.customer.number, event.customer.channelId);
        this.state = CallStates.Init;
    }

    applyChannelOriginatedEvent(event: ChannelOriginated) {
        this.customer.state = ChannelStates.Originated;
    }

    applyChannelHungUpEvent(event: ChannelHungUp) {
        this.customer.state = ChannelStates.HungUp;
    }

    applyChannelAnsweredEvent(event: ChannelAnswered) {
        this.customer.state = ChannelStates.Answered;
    }

    applyOutcallEndedEvent(event: OutcallEnded) {
        this.state = CallStates.HungUp;
    }

    applyIvrStartedEvent(event: IvrStarted) {
        this.ivr.state = IvrState.Started;
    }
    
    customerState(): ChannelStates {
        return this.customer.state;
    }

    isHangUp(): boolean {
        return this.state == CallStates.HungUp;
    }

    async start(): Promise<void> {
        await this.customer.dial(this.channels);
        const event = new ChannelOriginated(this.id, this.customer);
        this.uncommitedEvents.push(event);
        this.applyChannelOriginatedEvent(event);
    }

    async hangUp(): Promise<void> {
        if (this.isHangUp()) throw new CallAlreadyHungUpException(this.id);
        await this.closeCustomerChannel();
        const event = new OutcallEnded(this.id);
        this.applyOutcallEndedEvent(event);
        this.uncommitedEvents.push(event);
    }

    private async closeCustomerChannel() {
        await this.customer.hangUp(this.channels);
        const event = new ChannelHungUp(this.id, this.customer);
        this.applyChannelHungUpEvent(event);
        this.uncommitedEvents.push(event);
    }

    answerCustomer() {
        if (this.isHangUp()) throw new CallAlreadyHungUpException(this.id);
        if (this.customer.state === ChannelStates.Answered) throw new ChannelAlreadyAnsweredException(this.id, this.customer.channelId);
        const event = new ChannelAnswered(this.id, this.customer);
        this.applyChannelAnsweredEvent(event);
        this.uncommitedEvents.push(event);
    }

    startIvr() {
        const event = new IvrStarted(this.id);
        this.applyIvrStartedEvent(event);
        this.uncommitedEvents.push(event);
    }
};


