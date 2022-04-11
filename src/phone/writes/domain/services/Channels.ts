import { Channel, ChannelId } from "../aggregates/entities/Channel";
import { CallId } from "../aggregates/value-objects/CallId";

export interface Channels {
    say(id: CallId, message: string): Promise<void>;
    close(channelId: ChannelId): Promise<void>;
    dial(channel: Channel): Promise<void>;
}