import http from "k6/http";

export const options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages:[
        {duration: '10s', target:100}, // below normal load
        {duration: '1m', target:100},
        {duration: '10s', target:1400}, // spike to 1400 users
        {duration: '3m', target:1400}, // maintain at 1400 users
        {duration: '10s', target:100}, // ramp down
        {duration: '3m', target:100},
        {duration: '10s', target:100},
    ]
};

export default () => {
    const url = 'http://django-hotels-vpc4.ap-southeast-1.elasticbeanstalk.com/loadTest/';
    
    const payload = JSON.stringify({
      email: 'johndoe6@gmail.com',
      password: 'asffe23445A!',
    });
  
    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    http.get(url, params);
}
