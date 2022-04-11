import { PhoneErrorCodes } from "../phone/writes/domain/exceptions/PhoneErrorCodes";

export abstract class DomainException extends Error {
    code: PhoneErrorCodes;

    constructor(message: string, code: PhoneErrorCodes) {
        super(message)
        this.code = code;
    }
} 

export abstract class NotFoundException extends DomainException {
    
} 

export abstract class BadRequestException extends DomainException {
    
} 