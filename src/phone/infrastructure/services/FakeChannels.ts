import { Channel } from "../../domain/aggregates/entities/Channel";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { Channels } from "../../domain/services/Channels";

export class FakeChannels implements Channels {
    readonly closedChannels: Array<Channel> = new Array();
    readonly originatedChannels: Array<Channel> = new Array();

    close(channel: Channel): Promise<void> {
        this.closedChannels.push(channel);
        return Promise.resolve();
    }

    dial(channel: Channel): Promise<void> {
        this.originatedChannels.push(channel);
        return Promise.resolve();
    }
} 