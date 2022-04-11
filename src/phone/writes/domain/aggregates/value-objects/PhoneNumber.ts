import { PhoneNumberFactory } from "../../factories/phoneNumberFactory";

export class PhoneNumber {
    number: string;
    private constructor(value: string) {
        this.number = value
    }

    static Generate(phoneNumberFactory: PhoneNumberFactory, value: string): PhoneNumber
    {
        return new PhoneNumber(phoneNumberFactory.compose(value))
    } 
}
