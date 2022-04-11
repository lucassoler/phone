import { CallId } from "../value-objects/CallId";
import { OutcallEvent } from "./OutcallEvent";

export class OutcallEnded extends OutcallEvent {
    constructor(public readonly id: CallId) {
        super(id);
    }
} 