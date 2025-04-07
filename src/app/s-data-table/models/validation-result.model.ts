export class ValidationResult {
    error: boolean;
    errorMessage: string;

    constructor(error: boolean = false, errorMessage: string = "") {
        this.error = error;
        this.errorMessage = errorMessage;
    }
}