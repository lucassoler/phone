import { ChannelId, Channel } from "../../domain/aggregates/entities/Channel";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { Channels } from "../../domain/services/Channels";
import * as twilio from 'twilio';
import { InvalidPhoneNumber } from "../../domain/exceptions/InvalidPhoneNumber";

export class TwilioChannels implements Channels {
    private readonly client: twilio.Twilio;
    calls: Array<{callId: string, channelId: string}> = new Array();

    constructor() {    
        const accountSid = process.env.TWILIO_TEST_ACCOUNT_SID;
        const authToken = process.env.TWILIO_TEST_AUTH_TOKEN;
        this.client = twilio.default(accountSid, authToken);
    }

    async say(callId: CallId, message: string): Promise<void> {
        const call = this.calls.find(x => x.channelId == callId.id);
        await this.client.calls(call!.callId)
            .update({ twiml: `<Response><Say>${message}</Say></Response>`});
    }

    async close(channelId: ChannelId): Promise<void> {
        const call = this.calls.find(x => x.channelId == channelId.id);
        await this.client.calls(call!.callId)
            .remove();
    }

    async dial(channel: Channel): Promise<void> {
        try {
            const call = await this.client.calls
                .create({
                    url: 'http://demo.twilio.com/docs/voice.xml',
                    to: channel.number.number,
                    statusCallback: 'https://a6ac-2a01-e0a-1f7-80e0-d468-3e94-1b06-5b2c.ngrok.io/api/outcall/status',
                    statusCallbackMethod: 'POST',
                    statusCallbackEvent: ['initiated', 'answered', 'ringing', 'completed'],
                    from: process.env.VOICE_DEFAULT_FROM || ""
                });
    
            this.calls.push({callId: call.sid, channelId: channel.channelId.id});
        } catch (error: any) {
            if (error.code == 21217) {
                throw new InvalidPhoneNumber(channel.number.number);
            }

            throw error;
        }

        return Promise.resolve();
    }
}
