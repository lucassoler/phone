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

    async originate(channels: Channels): Promise<void> {
        await channels.originate(this);
    }

    async hangUp(channels: Channels): Promise<void> {
        await channels.close(this);
    }
}


export enum ChannelStates {
    Init,
    Originated,
    HungUp
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