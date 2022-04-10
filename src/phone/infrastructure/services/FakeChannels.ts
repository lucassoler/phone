import { Channel, ChannelId } from "../../domain/aggregates/entities/Channel";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { Channels } from "../../domain/services/Channels";

export class FakeChannels implements Channels {
    readonly closedChannels: Array<ChannelId> = new Array();
    readonly originatedChannels: Array<Channel> = new Array();

    close(channelId: ChannelId): Promise<void> {
        this.closedChannels.push(channelId);
        return Promise.resolve();
    }

    dial(channel: Channel): Promise<void> {
        this.originatedChannels.push(channel);
        return Promise.resolve();
    }
} 