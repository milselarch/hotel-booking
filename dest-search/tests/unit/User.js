import moment from 'moment'

const crypto = require("crypto");

class User {
  constructor() {
    this.date_now = new Date()
    this.timestamp = this.date_now.getTime();
    this.date_stamp = moment(this.date_now).format(
      'YYMMDD-hhmmss-SSS'
    );

    this.username = `test-user-${this.date_stamp}`
    this.email = this.generate_email(this.date_now)
    this.password = crypto.randomBytes(6).toString('hex');
    this.first_name = crypto.randomBytes(2).toString('hex');
    this.last_name = crypto.randomBytes(2).toString('hex');
  }

  generate_email(date_now) {
    if (date_now === undefined) {
      date_now = new Date();
    }
    const date_stamp = moment(date_now).format(
      'YYMMDD-hhmmss-SSS'
    );
    const email = `test-email-${date_stamp}@testmail.com`;
    return email;
  }
}

export default User