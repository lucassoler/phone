import { NotFoundException } from "../../../common/domainException";
import { PhoneErrorCodes } from "./PhoneErrorCodes";

export class IvrNotFound extends NotFoundException {
    constructor(ivrId: string) {
        super(`ivr ${ivrId} not found`, PhoneErrorCodes.IvrNotFound)
    }
}