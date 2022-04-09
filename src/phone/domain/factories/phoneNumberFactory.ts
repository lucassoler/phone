export interface PhoneNumberFactory {
    compose(number: string): string;
}