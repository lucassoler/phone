import { Channel } from "../../../../domain/aggregates/entities/Channel";
import { PhoneNumber } from "../../../../domain/aggregates/value-objects/PhoneNumber";
import { FakePhoneNumberFactory } from "../../../../infrastructure/factories/fakePhoneNumberFactory";
import { DEFAULT_CHANNEL_ID } from "../../../helpers/builders/OutcallBuilder";
import { TwilioChannels } from "../../../../infrastructure/services/TwilioChanels";

export const VALID_FROM = '+15005550006';
const VALID_TO = '+15005550006';


describe('Twilio - start outcall', () => {
    let channels: TwilioChannels;
    let phoneNumberFactory: FakePhoneNumberFactory;

    beforeEach(() => {
        channels = new TwilioChannels();
        phoneNumberFactory = new FakePhoneNumberFactory();
    });
    
    test('should dial number', async () => {
        const channel = Channel.from(PhoneNumber.Generate(phoneNumberFactory, VALID_TO), DEFAULT_CHANNEL_ID);
        await channels.dial(channel);
    });
});