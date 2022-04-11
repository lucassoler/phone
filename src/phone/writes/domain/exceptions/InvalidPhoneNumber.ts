import { BadRequestException } from "../../../common/domainException";
import { PhoneErrorCodes } from "./PhoneErrorCodes";

export class InvalidPhoneNumber extends BadRequestException {
    constructor(number: string) {
        super(`invalid phone number ${number}`, PhoneErrorCodes.InvalidPhoneNumber)
    }
} 