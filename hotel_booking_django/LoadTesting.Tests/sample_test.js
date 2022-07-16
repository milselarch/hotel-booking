import http from "k6/http";

export const options = {
    vus: 60,
    duration: '10s',
    insecureSkipTLSVerify: true,
    noConnectionReuse: false
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

