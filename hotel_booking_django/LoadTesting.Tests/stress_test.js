import http from "k6/http";

export const options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages:[
        {duration: '2m', target:100}, // below normal load
        {duration: '5m', target:100},
        {duration: '2m', target:200}, // normal load
        {duration: '5m', target:200},
        {duration: '2m', target:300}, // near limit
        {duration: '5m', target:300},
        {duration: '2m', target:400}, // beyond limit
        {duration: '5m', target:400},
        {duration: '10m', target:0}, // recovery
    ]
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