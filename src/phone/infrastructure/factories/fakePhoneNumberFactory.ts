import { PhoneNumberFactory } from "../../domain/factories/phoneNumberFactory";

export class FakePhoneNumberFactory implements PhoneNumberFactory {
    compose(number: string): string {
        return number
    }
} 