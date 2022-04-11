import { NotFoundException } from "../../../../common/domainException";
import { CallId } from "../aggregates/value-objects/CallId";
import { PhoneErrorCodes } from "./PhoneErrorCodes";

export class CallNotFoundException extends NotFoundException {
    constructor(callId: CallId) {
        super(`call ${callId.id} not found`, PhoneErrorCodes.CallNotFound)
    }
} 