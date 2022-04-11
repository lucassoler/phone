import { RegisteredCommandHandler } from "../../common/commandDispatcher"
import { AwesomePhoneNumberFactory } from "../writes/infrastructure/factories/awesomePhoneNumberFactory"
import { CallRepositoryInMemory } from "../writes/infrastructure/repositories/callRepositoryInMemory"
import { IvrRepositoryInMemory } from "../writes/infrastructure/repositories/IvrRepositoryInMemory"
import { FakeChannels } from "../writes/infrastructure/services/FakeChannels"
import { DEFAULT_ID } from "../writes/tests/helpers/builders/OutcallBuilder"
import { StartOutcallCommand, StartOutcallCommandHandler } from "../writes/usecases/commands/StartOutcallCommandHandler"

export const commandHandlers = (): RegisteredCommandHandler => ({
    [typeof StartOutcallCommand]: new StartOutcallCommandHandler(new AwesomePhoneNumberFactory(), new CallRepositoryInMemory(DEFAULT_ID, new IvrRepositoryInMemory(), new FakeChannels()), new FakeChannels(), new IvrRepositoryInMemory())
})