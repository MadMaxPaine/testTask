 class ApiError extends Error {
    constructor(status, message, errors = []) {
     super(message);
     this.status = status;
     this.message = message;
     this.errors = errors;
    }
    static badRequest(message, errors = []) {
     return new ApiError(400, message, errors);
    }   
    static forbidden(message) {
     return new ApiError(403, message);
    }
    static manyBadRequest(message, errors = []) {
        return new ApiError(429,"Too many requests!" + message, errors);
    }  
    static notFound(message) {
       return new ApiError(404, message || 'Not found');
     }
    static internal(message) {
        return new ApiError(500, message);
       } 
   }
   
   module.exports = ApiError;   