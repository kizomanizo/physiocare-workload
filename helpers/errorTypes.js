class ErrorTypes extends Error {
    constructor(status, name, message) {
        super(message);
        this.status = status;
        this.name = name;
        this.message = message;
    }

    static notFound(message) {
        return new ErrorTypes(404, message)
    }

    static badRequest(message) {
        return new ErrorTypes(400, message)
    }

    static internal(message) {
        return new ErrorTypes(500, message)
    }

}

module.exports = ErrorTypes;