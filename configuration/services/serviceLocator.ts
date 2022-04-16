import { CommandDispatcher, InternalCommandDispatcher } from "../../src/common/commandDispatcher";
import { EventPublisher, InternalEventPublisher } from "../../src/common/EventPublisher";
import { phoneCommandHandlers } from "../../src/phone/configuration/commandHandlers";
import { ChannelAnswered } from "../../src/phone/writes/domain/aggregates/events/ChannelAnswered";
import { CallId } from "../../src/phone/writes/domain/aggregates/value-objects/CallId";
import { PhoneNumberFactory } from "../../src/phone/writes/domain/factories/phoneNumberFactory";
import { CallRepository } from "../../src/phone/writes/domain/repositories/callRepository";
import { IvrRepository } from "../../src/phone/writes/domain/repositories/IvrRepository";
import { Channels } from "../../src/phone/writes/domain/services/Channels";
import { AwesomePhoneNumberFactory } from "../../src/phone/writes/infrastructure/factories/awesomePhoneNumberFactory";
import { CallRepositoryInMemory } from "../../src/phone/writes/infrastructure/repositories/callRepositoryInMemory";
import { IvrRepositoryInMemory } from "../../src/phone/writes/infrastructure/repositories/IvrRepositoryInMemory";
import { FakeChannels } from "../../src/phone/writes/infrastructure/services/FakeChannels";
import { TwilioChannels } from "../../src/phone/writes/infrastructure/services/TwilioChanels";
import { An } from "../../src/phone/writes/tests/helpers/builders/An";
import { StartIvrOnChannelAnsweredEventHandler } from "../../src/phone/writes/usecases/events/StartIvrOnChannelAnsweredEventHandler";

export type Dependencies = Readonly<{
  commandDispatcher: CommandDispatcher,
}>;

export const serviceLocator = (): Dependencies => {

  const channels: Channels = new TwilioChannels();
  const ivrRepository: IvrRepository = new IvrRepositoryInMemory([An.Ivr().withAction(An.IvrAction().saying('HELLO ! How are you ?').build()).build()]);
  const callRepository: CallRepository = new CallRepositoryInMemory(CallId.from('1'), ivrRepository, channels);
  const phoneNumberFactory: PhoneNumberFactory = new AwesomePhoneNumberFactory();
  const eventPublisher: EventPublisher = new InternalEventPublisher();

  eventPublisher.registerHandlers({
    [ChannelAnswered.name]: new StartIvrOnChannelAnsweredEventHandler(callRepository)
  })

  const commandDispatcher = new InternalCommandDispatcher();
  commandDispatcher.registerHandlers({
      ...phoneCommandHandlers(phoneNumberFactory, callRepository, channels, ivrRepository, eventPublisher)
  });

  return {
      commandDispatcher
  };
} 