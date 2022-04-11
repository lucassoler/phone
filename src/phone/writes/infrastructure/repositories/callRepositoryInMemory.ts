import { OutcallEvent } from "../../domain/aggregates/events/OutcallEvent";
import { Outcall } from "../../domain/aggregates/Outcall";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { CallNotFoundException } from "../../domain/exceptions/CallNotFoundException";
import { CallRepository } from "../../domain/repositories/callRepository";
import { IvrRepository } from "../../domain/repositories/IvrRepository";
import { Channels } from "../../domain/services/Channels";
import { DEFAULT_ID } from "../../tests/helpers/builders/OutcallBuilder";

export class CallRepositoryInMemory implements CallRepository {
    outCalls: Array<Outcall> = new Array();
    events: Array<OutcallEvent> = new Array();

    constructor(private nextId: CallId = DEFAULT_ID, 
        private readonly ivrRepository: IvrRepository, 
        private readonly channels: Channels) {
    }

    nextCallId(): CallId {
        return this.nextId;
    }

    async byId(callId: CallId): Promise<Outcall> {
        const events = this.events.filter(x => x.id.sameAs(callId.id));
        if (events.length == 0) throw new CallNotFoundException(callId);
        const call = await Outcall.rehydrate(events, this.ivrRepository, this.channels);
        return Promise.resolve(call);
    }

    async save(call: Outcall): Promise<void> {
        this.events.push(...call.uncommitedEvents);
        return Promise.resolve();
    }
};
