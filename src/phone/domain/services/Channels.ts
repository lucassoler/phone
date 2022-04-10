import { Channel, ChannelId } from "../aggregates/entities/Channel";

export interface Channels {
    close(channelId: ChannelId): Promise<void>;
    dial(channel: Channel): Promise<void>;
}