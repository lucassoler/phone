import { ChannelId, Channel } from "../../domain/aggregates/entities/Channel";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { Channels } from "../../domain/services/Channels";
import { VALID_FROM } from "../../tests/integration/channels/twilio/twilio-start-outcall.test";
import * as twilio from 'twilio';


export class TwilioChanels implements Channels {
    private readonly client: twilio.Twilio;

    constructor() {    
        const accountSid = process.env.TWILIO_TEST_ACCOUNT_SID;
        const authToken = process.env.TWILIO_TEST_AUTH_TOKEN;
        this.client = twilio.default(accountSid, authToken);
    }

    say(id: CallId, message: string): Promise<void> {
        return Promise.resolve();
    }
    close(channelId: ChannelId): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async dial(channel: Channel): Promise<void> {
        const call = await this.client.calls
            .create({
                to: channel.number.number,
                from: VALID_FROM
            });

        return Promise.resolve();
    }
}