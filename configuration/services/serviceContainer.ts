import {
    AwilixContainer,
    asFunction,
    asValue,
    asClass,
    InjectionMode,
    createContainer,
    Resolver,
    ResolveOptions,
    ContainerOptions
  } from "awilix";
import { FakePhoneNumberFactory } from "../../src/phone/writes/infrastructure/factories/fakePhoneNumberFactory";
import { CallRepositoryInMemory } from "../../src/phone/writes/infrastructure/repositories/callRepositoryInMemory";
import { IvrRepositoryInMemory } from "../../src/phone/writes/infrastructure/repositories/IvrRepositoryInMemory";
import { FakeUuidGenerator } from "../../src/phone/writes/infrastructure/services/FakeUuidGenerator";
import { TwilioChannels } from "../../src/phone/writes/infrastructure/services/TwilioChanels";

export const serviceContainer = () => {
  const container = createContainer({
    injectionMode: InjectionMode.PROXY
  });

  container.register({
      PhoneNumberFactory: asClass(FakePhoneNumberFactory).singleton(),
      CallRepository: asClass(CallRepositoryInMemory).scoped(),
      IvrRepository: asClass(IvrRepositoryInMemory).scoped(),
      Channels: asClass(TwilioChannels).scoped(),
      UuidGenerator: asClass(FakeUuidGenerator).singleton()
  });

  return container;
}