import { URLSearchParams } from 'https://jslib.k6.io/url/1.0.0/index.js';
import http from "k6/http";
import { check, group, sleep, fail } from 'k6';

export const options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages:[
        {duration: '2m', target:100}, 
        {duration: '2m', target:150}, // limit is around 180 concurrent users at the same time
        {duration: '2m', target:0}, 
    ],
    thresholds: {
        http_req_duration: ["p(99)<150"]
    }
};

function randomString(length, charset = '') {
  if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';
  let res = '';
  while (length--) res += charset[(Math.random() * charset.length) | 0];
  return res;
}

const USERNAME = `${randomString(10)}@example.com`;
const PASSWORD = 'loadTEST123!@#';
const BASE_URL = 'http://localhost:8000';

function allAreTrue(arr) {
  return arr.every(element => element === true);
}

export function setup() {
  // register a new user and authenticate via a JWT token.
  const res = http.post(`${BASE_URL}/auth/users/`, {
    first_name: 'Johnny',
    last_name: 'Depp',
    email: USERNAME,
    password: PASSWORD,
    re_password: PASSWORD,
  });

  check(res, { 'created user': (res) => res.status === 201 });

  // login to get a JWT token.
  const loginRes = http.post(`${BASE_URL}/auth/jwt/create/`, {
    email: USERNAME,
    password: PASSWORD,
  });

  const authToken = loginRes.json('access');
  check(authToken, { 'logged in successfully': () => authToken !== '' });

  return authToken;
}

export default (authToken) => {
  const requestConfigWithTag = () => ({
    headers: {
      "Authorization": `JWT ${authToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  });

  group('Public endpoints', () => {

    const responses = http.batch([
      ['GET', `${BASE_URL}/loadtest/`, null],
    ]);

    const statuses = Object.values(responses).map((res) => res.status === 200);

    // Functional test: check that all values in statuses are true
    check(statuses, {
      'Endpoints returned successfully': allAreTrue(statuses),
    });
    sleep(1)
  });

  group('Create and Retrieve booking', () => {
    group('Create booking', () => {
      const payload = {
        "destination_id": "kbgr",
        "hotel_id": "zqBa",
        "room_type_id": "314254542",
        "room_breakfast_info": "b_info",
        "destination_region": "DEST_REGION",
        "hotel_name": "h_name",
        "room_type": "room_type",
        "booking_id": "b_id",
        "check_in_date": "2022-08-30",
        "check_out_date": "2022-09-03",
        "cost_in_sgd": "99",
        "number_of_rooms": "1",
        "number_of_guests_per_rooms": "2",
        "special_request": "nahh",
        "primary_guest_title": "MR",
        "primary_guest_first_name": "Johnny",
        "primary_guest_last_name": "Depp",
        "primary_guest_email": "Johnny_Depp@gmail.com",
        "primary_guest_phone": "95634586",
        "primary_guest_phone_country": "Singapore",
        "did_primary_guest_accept_tnc": true,
        "name_on_card": "Johnny Depp",
        "card_number": "4263982640269299",
        "billing_address_address": "235 Sixth Avenue Very Rich Building",
        "billing_address_country": "Singapore",
        "billing_address_city": "Singapore",
        "billing_address_post_code": "024543",
        "security_code": "593",
        "expiry_date": "2024-01-01"
      };
  
      const booking_creation_res = http.post(`${BASE_URL}/loadTest/booking/`, payload, requestConfigWithTag());
      if (check(booking_creation_res, { 'Booking created correctly': (booking_creation_res) => booking_creation_res.status === 201 })) {
        // pass
      } else {
        console.log(`Unable to create a Booking ${booking_creation_res.status} ${booking_creation_res.body}`);
      }

    })

    group('Retrieve booking', () => {
      const url = `${BASE_URL}/booking/`;
      const booking_res = http.get(url, requestConfigWithTag());
      check(booking_res, { 'Booking retrieved': (booking_res) => booking_res.status === 200 });
    })
    

  });

  sleep(1);
};