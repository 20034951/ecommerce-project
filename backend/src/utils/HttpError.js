export default class HttpError extends Error {
    constructor(message, statusCode = 500){
        super(message);
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}