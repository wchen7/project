export default function makeRequest (route, method, body) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-type': 'application/json',
        Authorization: (route === '/admin/auth/register' || route === '/admin/auth/login') ? undefined : `Bearer ${localStorage.getItem('token')}`,
      },
    };
    if (method !== 'GET') {
      options.body = JSON.stringify(body);
    }
    fetch('http://localhost:5005' + route, options)
      .then((rawresponse) => {
        return rawresponse.json();
      }).then((data) => {
        if (data.error) {
          reject(data);
        } else {
          resolve(data);
        }
      });
  });
}
