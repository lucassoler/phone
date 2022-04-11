import { CallId } from "../value-objects/CallId";
import { OutcallEvent } from "./OutcallEvent";

export class IvrStarted extends OutcallEvent {
    constructor(public readonly id: CallId) {
        super(id);
    }
} 