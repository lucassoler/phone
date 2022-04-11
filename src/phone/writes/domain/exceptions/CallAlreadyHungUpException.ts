import { BadRequestException } from "../../../../common/domainException";
import { CallId } from "../aggregates/value-objects/CallId";
import { PhoneErrorCodes } from "./PhoneErrorCodes";

export class CallAlreadyHungUpException extends BadRequestException {
    constructor(callId: CallId) {
        super(`call ${callId.id} already hung up`, PhoneErrorCodes.CallAlreadyHungUp)
    }
} 