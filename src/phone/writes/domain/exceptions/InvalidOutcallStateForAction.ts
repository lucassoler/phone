import { BadRequestException } from "../../../../common/domainException";
import { PhoneErrorCodes } from "./PhoneErrorCodes";

export class InvalidOutcallStateForAction extends BadRequestException {
    constructor() {
        super(`invalid outcall state for action performed`, PhoneErrorCodes.InvalidOutcallStateForAction)
    }
}