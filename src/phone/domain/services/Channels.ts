import { Channel } from "../aggregates/entities/Channel";

export interface Channels {
    close(channel: Channel): Promise<void>;
    originate(channel: Channel): Promise<void>;
}