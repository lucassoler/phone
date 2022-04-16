import { Channel } from "../../../../domain/aggregates/entities/Channel";
import { PhoneNumber } from "../../../../domain/aggregates/value-objects/PhoneNumber";
import { FakePhoneNumberFactory } from "../../../../infrastructure/factories/fakePhoneNumberFactory";
import { DEFAULT_CHANNEL_ID } from "../../../helpers/builders/OutcallBuilder";
import { TwilioChannels } from "../../../../infrastructure/services/TwilioChanels";
import { InvalidPhoneNumber } from "../../../../domain/exceptions/InvalidPhoneNumber";

const VALID_TO = '+15005550006';
const INVALID_TO = '+15005550001';

describe('Twilio - start outcall', () => {
    let channels: TwilioChannels;
    let phoneNumberFactory: FakePhoneNumberFactory;

    beforeEach(() => {
        channels = new TwilioChannels();
        phoneNumberFactory = new FakePhoneNumberFactory();
    });
    
    test('should dial valid number works', async () => {
        const channel = Channel.from(PhoneNumber.Generate(phoneNumberFactory, VALID_TO), DEFAULT_CHANNEL_ID);
        await channels.dial(channel);
    });
    
    test('dial an invalid number should throw an error', async () => {
        const channel = Channel.from(PhoneNumber.Generate(phoneNumberFactory, INVALID_TO), DEFAULT_CHANNEL_ID);
        await expect(channels.dial(channel)).rejects.toThrowError(new InvalidPhoneNumber(INVALID_TO));
    });
});