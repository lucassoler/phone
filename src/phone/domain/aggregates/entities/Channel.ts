import { Channels } from "../../services/Channels";
import { PhoneNumber } from "../value-objects/PhoneNumber";

export class Channel {
    number: PhoneNumber;
    channelId: ChannelId;
    state: ChannelStates = ChannelStates.Init;

    private constructor(number: PhoneNumber, channelId: ChannelId) {
        this.number = number;
        this.channelId = channelId;
    }

    static from(number: PhoneNumber, channelId: ChannelId) {
        return new Channel(number, channelId);
    }

    async dial(channels: Channels): Promise<void> {
        await channels.dial(this);
    }

    async hangUp(channels: Channels): Promise<void> {
        await channels.close(this.channelId);
    }
}




export enum ChannelStates {
    Init,
    Originated,
    HungUp,
    Answered
}

export class ChannelId {
    readonly id: string;

    private constructor(id: string) {
        this.id = id;
    }

    static from(channelId: string): ChannelId {
        return new ChannelId(channelId);
    }
}