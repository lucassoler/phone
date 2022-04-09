import { PhoneNumberFactory } from "../../domain/factories/phoneNumberFactory";
import { AwesomePhoneNumberFactory } from "../../infrastructure/factories/awesomePhoneNumberFactory";

const VALID_NUMBER = "+33695403010";
const INVALID_NUMBER = "00";
describe('Phone number value object', () => {
    var phoneNumberFactory: PhoneNumberFactory;
    
    beforeEach(() => {
        phoneNumberFactory = new AwesomePhoneNumberFactory()
    })


    test("with an invalid number", () => {
        expect(() => phoneNumberFactory.compose(INVALID_NUMBER)).toThrowError(new Error('invalid phone number'))
    })

    test('with a valid number', () => {
        expect(phoneNumberFactory.compose(VALID_NUMBER)).toBe(VALID_NUMBER)
    });


});