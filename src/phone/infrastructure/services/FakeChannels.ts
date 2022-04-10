import { Channel, ChannelId } from "../../domain/aggregates/entities/Channel";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { Channels } from "../../domain/services/Channels";

export class FakeChannels implements Channels {
    readonly closedChannels: Array<ChannelId> = new Array();
    readonly originatedChannels: Array<Channel> = new Array();
    readonly says: Array<{callId: CallId, message: string}> = new Array();

    close(channelId: ChannelId): Promise<void> {
        this.closedChannels.push(channelId);
        return Promise.resolve();
    }

    dial(channel: Channel): Promise<void> {
        this.originatedChannels.push(channel);
        return Promise.resolve();
    }
    say(callId: CallId, message: string): Promise<void> {
        this.says.push({callId, message});
        return Promise.resolve();
    }
} 