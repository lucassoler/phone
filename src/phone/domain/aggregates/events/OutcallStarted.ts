import { Channel } from "../entities/Channel";
import { IvrId } from "../entities/Ivr";
import { CallId } from "../value-objects/CallId";
import { OutcallEvent } from "./OutcallEvent";

export class OutcallStarted extends OutcallEvent {
    constructor(public readonly id: CallId, public readonly ivrId: IvrId, public readonly customer: Channel) {
        super(id);
    }
} 