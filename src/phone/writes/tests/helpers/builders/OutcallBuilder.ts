import { ChannelId, Channel } from "../../../domain/aggregates/entities/Channel";
import { Ivr } from "../../../domain/aggregates/entities/Ivr";
import { ChannelAnswered } from "../../../domain/aggregates/events/ChannelAnswered";
import { OutcallEnded } from "../../../domain/aggregates/events/OutcallEnded";
import { Outcall } from "../../../domain/aggregates/Outcall";
import { CallId } from "../../../domain/aggregates/value-objects/CallId";
import { PhoneNumber } from "../../../domain/aggregates/value-objects/PhoneNumber";
import { PhoneNumberFactory } from "../../../domain/factories/phoneNumberFactory";
import { Channels } from "../../../domain/services/Channels";
import { FakePhoneNumberFactory } from "../../../infrastructure/factories/fakePhoneNumberFactory";
import { FakeChannels } from "../../../infrastructure/services/FakeChannels";
import { An } from "./An";

export const DEFAULT_CUSTOMER = "+33601020304";
export const DEFAULT_ID = CallId.from("d79d3049-1833-4938-8b5a-b4915c2a2b6e");
export const DEFAULT_CHANNEL_ID = ChannelId.from("d79d3049-1833-4938-8b5a-b4915c2a2b6e");
export const DEFAULT_CHANNEL = Channel.from(PhoneNumber.Generate(new FakePhoneNumberFactory(), DEFAULT_CUSTOMER), DEFAULT_CHANNEL_ID);

export class OutcallBuilder {
    private phoneNumberFactory: PhoneNumberFactory;
    private channels: Channels;

    constructor() {
        this.phoneNumberFactory = new FakePhoneNumberFactory();
        this.channels = new FakeChannels();
        this.customer = DEFAULT_CHANNEL;
    }

    customer: Channel;
    ivr: Ivr = An.Ivr().build();
    id: CallId = DEFAULT_ID
    isHungUp = false
    isAnswered = false

    withId(id: string): OutcallBuilder {
        this.id = CallId.from(id);
        return this;
    }

    withCustomer(number: string): OutcallBuilder {
        this.customer = Channel.from(PhoneNumber.Generate(this.phoneNumberFactory, number), DEFAULT_CHANNEL_ID);
        return this;
    }

    hungUp(): OutcallBuilder {
        this.isHungUp = true;
        return this;
    }

    answered(): OutcallBuilder {
        this.isAnswered = true;
        return this;
    }

    build() {
        const call = Outcall.from(this.id, this.customer, this.ivr, this.channels);
        if (this.isHungUp) call.uncommitedEvents.push(new OutcallEnded(this.id));
        if (this.isAnswered) call.uncommitedEvents.push(new ChannelAnswered(this.id, this.customer));
        return call;
    }
}
