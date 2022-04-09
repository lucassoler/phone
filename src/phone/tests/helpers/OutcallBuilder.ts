import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { PhoneNumber } from "../../domain/aggregates/value-objects/PhoneNumber";
import { FakePhoneNumberFactory } from "../../infrastructure/factories/fakePhoneNumberFactory";
import { PhoneNumberFactory } from "../../domain/factories/phoneNumberFactory";
import { Channel, ChannelId } from "../../domain/aggregates/entities/Channel";
import { Outcall } from "../../domain/aggregates/Outcall";
import { FakeChannels } from "../../infrastructure/services/FakeChannels";
import { Channels } from "../../domain/services/Channels";
import { OutcallEnded } from "../../domain/aggregates/events/OutcallEnded";

export const DEFAULT_CUSTOMER = "+33601020304";
export const DEFAULT_ID = "d79d3049-1833-4938-8b5a-b4915c2a2b6e";
export const DEFAULT_CHANNEL_ID = "d79d3049-1833-4938-8b5a-b4915c2a2b6e";

export class OutcallBuilder {
    private phoneNumberFactory: PhoneNumberFactory;
    private channels: Channels;

    constructor() {
        this.phoneNumberFactory = new FakePhoneNumberFactory();
        this.channels = new FakeChannels();
        this.customerNumber = Channel.from(PhoneNumber.Generate(new FakePhoneNumberFactory(), DEFAULT_CUSTOMER), ChannelId.from(DEFAULT_CHANNEL_ID));
    }

    customerNumber: Channel;
    id: CallId = CallId.from(DEFAULT_ID)
    isHungUp = false

    withId(id: string): OutcallBuilder {
        this.id = CallId.from(id);
        return this;
    }

    withCustomer(number: string): OutcallBuilder {
        this.customerNumber = Channel.from(PhoneNumber.Generate(this.phoneNumberFactory, number), ChannelId.from(DEFAULT_CHANNEL_ID));
        return this;
    }

    hungUp(): OutcallBuilder {
        this.isHungUp = true;
        return this;
    }

    build() {
        const call = Outcall.from(this.id, this.customerNumber, this.channels);
        if (this.isHungUp) call.uncommitedEvents.push(new OutcallEnded(this.id));
        
        return call;
    }
}
