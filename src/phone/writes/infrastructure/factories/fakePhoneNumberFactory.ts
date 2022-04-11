import { InvalidPhoneNumber } from "../../domain/exceptions/InvalidPhoneNumber";
import { PhoneNumberFactory } from "../../domain/factories/phoneNumberFactory";

export class FakePhoneNumberFactory implements PhoneNumberFactory {
    private errorToThrow: Error | null = null;
    compose(number: string): string {
        if (this.errorToThrow) throw this.errorToThrow;
        return number
    }
    throwError(error: InvalidPhoneNumber) {
        this.errorToThrow = error;
    }
} 