class RequiredBodyError extends Error {
  constructor(notIncludedFields) {
    super();
    this.status = 400;
    this.message = `Request must include the fields: ${notIncludedFields.join(
      ", "
    )}.`;
  }
}

module.exports = { RequiredBodyError };
