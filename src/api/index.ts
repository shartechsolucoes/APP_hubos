import axios from 'axios';

const secret = localStorage.getItem('token');

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: { Authorization: `Bearer ${secret}` },
});
