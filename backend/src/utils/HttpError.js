export default class HttpError extends Error {
    constructor(statusCode = 500, message = 'Internal Server Error'){
        super(message);
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}