export default async function asyncAPI (route) {
  const response = await fetch('http://localhost:5005' + route, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  })
  const data = await response.json();
  return data;
}
