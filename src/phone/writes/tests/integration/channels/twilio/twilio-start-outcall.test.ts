import { Channel } from "../../../../domain/aggregates/entities/Channel";
import { PhoneNumber } from "../../../../domain/aggregates/value-objects/PhoneNumber";
import { FakePhoneNumberFactory } from "../../../../infrastructure/factories/fakePhoneNumberFactory";
import { DEFAULT_CHANNEL_ID } from "../../../helpers/builders/OutcallBuilder";
import { TwilioChanels } from "../../../../infrastructure/services/TwilioChanels";

export const VALID_FROM = '+15005550006';
const VALID_TO = '+15005550006';


describe('Twilio - start outcall', () => {
    let channels: TwilioChanels;
    let phoneNumberFactory: FakePhoneNumberFactory;

    beforeEach(() => {
        channels = new TwilioChanels();
        phoneNumberFactory = new FakePhoneNumberFactory();
    });
    
    test('should ', async () => {
        const channel = Channel.from(PhoneNumber.Generate(phoneNumberFactory, VALID_TO), DEFAULT_CHANNEL_ID);
        await channels.dial(channel);
    });
});