// class that genereates random string
type AllowedCharOptions = {
  lowercase?: boolean;
  uppercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
};
export class LabelNumber {
  protected charset;

  constructor() {
    this.charset = {
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '~!@#$%^&*()_+-=[]{}|;:,./<>?',
    };
  }
  randomString(kwargs: { length: number; chars: AllowedCharOptions }): string {
    const { length, chars } = kwargs;
    let mask = '';
    let result = '';

    if (chars.lowercase) mask += this.charset.lowercase;
    if (chars.uppercase) mask += this.charset.uppercase;
    if (chars.numbers) mask += this.charset.numbers;
    if (chars.symbols) mask += this.charset.symbols;

    for (let i = length; i > 0; --i) {
      result += mask.charAt(Math.floor(Math.random() * mask.length));
    }
    return result;
  }

  /**
   * generate unique 13 character number
   * Example: '165780949818EJ'
   * The first 12 characters are random digits from the epoch timestamp and the last two characters are letters.
   * @returns {string}
   */
  private generate = (): string => {
    const timestampString = new Date().getTime().toString().slice(1, 12);
    const randomChars = this.randomString({
      length: 2,
      chars: { uppercase: true },
    });

    const trackingNumber = `${timestampString}${randomChars}`;
    return trackingNumber;
  };

  calculateExpiryDate(issueDate: Date = new Date()): Date {
    // Calculate expiry date as two years from the issue date
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);

    return expiryDate;
  }

  toString(): string {
    return this.generate();
  }
}
