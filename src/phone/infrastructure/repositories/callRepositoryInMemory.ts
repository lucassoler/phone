import { ChannelId } from "../../domain/aggregates/entities/Channel";
import { OutcallEvent } from "../../domain/aggregates/events/OutcallEvent";
import { Outcall } from "../../domain/aggregates/Outcall";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { CallNotFoundException } from "../../domain/exceptions/CallNotFoundException";
import { CallRepository } from "../../domain/repositories/callRepository";
import { Channels } from "../../domain/services/Channels";

export class CallRepositoryInMemory implements CallRepository {
    outCalls: Array<Outcall> = new Array();
    events: Array<OutcallEvent> = new Array();
    nextId: string = "1";

    constructor(nextId: string = "1", private readonly channels: Channels) {
        this.nextId = nextId;
    } 

    nextChannelId(): ChannelId {
        return ChannelId.from(this.nextId);
    }

    nextCallId(): CallId {
        return CallId.from(this.nextId)
    }

    byId(callId: CallId): Promise<Outcall> {
        const events = this.events.filter(x => x.id.sameAs(callId));
        if (events.length == 0) throw new CallNotFoundException(callId);
        const call = Outcall.rehydrate(events, this.channels);
        return Promise.resolve(call);
    }

    save(call: Outcall): Promise<void> {
        this.events.push(...call.uncommitedEvents);
        return Promise.resolve();
    }
};
