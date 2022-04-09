import { Channel } from "../aggregates/entities/Channel";

export interface Channels {
    close(channel: Channel): Promise<void>;
    dial(channel: Channel): Promise<void>;
}