export class Email {
  private readonly _emailAddress: string

  constructor(email: string) {
    if (!Email.isValid(email)) {
      throw new Error('Email is invalid')
    }
    this._emailAddress = email
  }

  get value(): string {
    return this._emailAddress
  }

  /**
   * Return domain (after @) of email.
   */
  get domain(): string {
    return this._emailAddress.split('@')[1]
  }

  public static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  public equals(other: Email): boolean {
    return this._emailAddress === other._emailAddress
  }
}
