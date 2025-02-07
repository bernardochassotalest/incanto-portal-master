export default class FieldValidationError extends Error {
  constructor (field, message) {
    super(message);    
    this.name = this.constructor.name;
    this.field = field

    Error.captureStackTrace(this, this.constructor)
  }
}
