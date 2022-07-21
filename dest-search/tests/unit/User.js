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
    this.email = `test-email-${this.date_stamp}@testmail.com`
    this.password = crypto.randomBytes(6).toString('hex');
    this.first_name = crypto.randomBytes(2).toString('hex');
    this.last_name = crypto.randomBytes(2).toString('hex');
  }
}

export default User