import axios from 'axios';

export default async function makeRequest(method, url, data, headers = {}) {
	try {
		// Set the "Content-Type" header to "application/json"
		const requestHeaders = { ...headers, 'Content-Type': 'application/json' };

		let response;
		switch (method.toLowerCase()) {
			case 'post':
				response = await axios.post(url, data, { headers: requestHeaders });
				break;
			case 'get':
				response = await axios.get(url, { headers: requestHeaders });
				break;
			case 'put':
				response = await axios.put(url, data, { headers: requestHeaders });
				break;
			case 'delete':
				response = await axios.delete(url, { headers: requestHeaders });
				break;
			default:
				throw new Error('Invalid HTTP method');
		}

		// Handle successful response (status code 200)
		return response.data;
	} catch (error) {
		// Handle the error
		if (error.response) {
			// The request was made and the server responded with a non-2xx status code
			return error.response.status;
		} else if (error.request) {
			// The request was made but no response was received
			console.log('No response received:', error.request);
			// Re-throw other errors for further handling
			throw error;
		} else {
			// Something happened in setting up the request that triggered an error
			console.log('Error:', error.message);
			// Re-throw other errors for further handling
			throw error;
		}
	}
}
