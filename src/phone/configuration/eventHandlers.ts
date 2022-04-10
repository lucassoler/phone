import { RegisteredEventHandler } from "../../common/EventPublisher";

export const eventHandlers = (): RegisteredEventHandler => ({
    //[typeof StartOutcallCommand]: new StartOutcallCommandHandler(new AwesomePhoneNumberFactory(), new CallRepositoryInMemory(DEFAULT_ID, new IvrRepositoryInMemory(), new FakeChannels()), new FakeChannels(), new IvrRepositoryInMemory())
})