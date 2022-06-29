import axios from 'axios';

import { getUserToken } from '../utils/sessionManager';
import { BANK_LIST, PROJECTS } from '../constants/api';
const access_token = getUserToken();

export function listFsp(params) {
	return new Promise((resolve, reject) => {
		axios(BANK_LIST, { params })
			.then(d => {
				resolve(d);
			})
			.catch(err => reject(err?.response?.data));
	});
}

export function addFsp(id, payload) {
	console.log(id, payload);
	return new Promise((resolve, reject) => {
		axios
			.post(`${PROJECTS}/${id}/institutions/new`, payload, {
				headers: { access_token: access_token }
			})
			.then(res => {
				if (res.statusText === 'OK') {
					resolve(res.data);
				}
				reject(res.data);
			})
			.catch(err => {
				reject({ statusText: 'FAIL', data: {} });
			});
	});
}

export function listProjectFsp(id, payload) {
	return new Promise((resolve, reject) => {
		axios
			.get(`${PROJECTS}/${id}/institutions`, {
				headers: { access_token: access_token }
			})
			.then(res => {
				if (res.statusText === 'OK') {
					resolve(res.data);
				}
				reject(res.data);
			})
			.catch(err => {
				reject({ statusText: 'FAIL', data: {} });
			});
	});
}
