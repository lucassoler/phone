import { InvalidPhoneNumber } from "../../domain/exceptions/InvalidPhoneNumber";
import { PhoneNumberFactory } from "../../domain/factories/phoneNumberFactory";
var AwesomePhoneNumber = require( 'awesome-phonenumber' );

export class AwesomePhoneNumberFactory implements PhoneNumberFactory {
    compose(number: string): string {
        var phone = new AwesomePhoneNumber(number)
        if (!phone.isValid()) throw new InvalidPhoneNumber(number)
        return number;
    }
}