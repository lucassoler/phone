import { Channels } from "../services/Channels";
import { Channel, ChannelStates } from "./entities/Channel";
import { ChannelHungUp } from "./events/ChannelHungUp";
import { ChannelOriginated } from "./events/ChannelOriginated";
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
    private events: Array<OutcallEvent> = new Array();

    private constructor(id: CallId, customer: Channel, private readonly channels: Channels) {
        this.id = id;
        this.customer = customer;
    }

    static from(id: CallId, customer: Channel, channels: Channels)
    {
        const call = new Outcall(id, customer, channels);
        call.init();
        return call;
    } 

    static rehydrate(events: OutcallEvent[], channels: Channels): Outcall {
        const startedEvent = events.find(x => x instanceof OutcallStarted) as OutcallStarted;
        const call = new Outcall(startedEvent.id, startedEvent.customer, channels);
        call.applyEvents(events);
        return call;
    }

    init() {
        const event = new OutcallStarted(this.id, this.customer);
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

    applyOutcallEndedEvent(event: OutcallEnded) {
        this.state = CallStates.HungUp;
    }
    
    customerState(): ChannelStates {
        return this.customer.state;
    }

    isHangUp(): boolean {
        return this.state == CallStates.HungUp;
    }

    async start(): Promise<void> {
        await this.customer.originate(this.channels);
        const event = new ChannelOriginated(this.id, this.customer);
        this.uncommitedEvents.push(event);
        this.applyChannelOriginatedEvent(event);
    }

    async hangUp(): Promise<void> {
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
};


