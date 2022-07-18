import http from "k6/http";

export const options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages:[
        {duration: '5m', target:200}, 
        {duration: '10m', target:200},
        {duration: '5m', target:0}, 
    ],
    thresholds: {
        http_req_duration: ["p(99)<150"]
    }
};

export default () => {
    const url = 'http://localhost:8000/loadTest/';
    
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