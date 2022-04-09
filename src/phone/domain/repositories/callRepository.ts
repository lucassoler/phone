import { ChannelId } from "../aggregates/entities/Channel";
import { Outcall } from "../aggregates/Outcall";
import { CallId } from "../aggregates/value-objects/CallId";

export interface CallRepository {
    byId(callId: CallId): Promise<Outcall>;
    save(call: Outcall): Promise<void>;
    nextCallId(): CallId;
};
