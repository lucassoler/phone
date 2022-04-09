import { Channel } from "../entities/Channel";
import { CallId } from "../value-objects/CallId";
import { OutcallEvent } from "./OutcallEvent";

export class ChannelOriginated extends OutcallEvent {
    constructor(public readonly id: CallId, public readonly channel: Channel) {
        super(id);
    }
}