import { DomainEvent } from "../../../../../common/domainEvent";
import { CallId } from "../value-objects/CallId";

export class OutcallEvent extends DomainEvent {
    constructor(public readonly id: CallId) {
        super();
    }
} 