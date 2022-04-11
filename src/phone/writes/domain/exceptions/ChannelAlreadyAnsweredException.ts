import { BadRequestException } from "../../../../common/domainException";
import { ChannelId } from "../aggregates/entities/Channel";
import { CallId } from "../aggregates/value-objects/CallId";
import { PhoneErrorCodes } from "./PhoneErrorCodes";

export class ChannelAlreadyAnsweredException extends BadRequestException {
    constructor(callId: CallId, channelId: ChannelId) {
        super(`channel ${channelId.id} from call ${callId.id} already answered`, PhoneErrorCodes.ChannelAlreadyAnswered)
    }
}