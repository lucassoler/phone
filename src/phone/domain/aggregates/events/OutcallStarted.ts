import { Channel } from "../entities/Channel";
import { CallId } from "../value-objects/CallId";
import { OutcallEvent } from "./OutcallEvent";

export class OutcallStarted extends OutcallEvent {
    constructor(public readonly id: CallId, public readonly customer: Channel) {
        super(id);
    }
} 