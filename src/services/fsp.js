import axios from 'axios';
import { BANK_LIST } from '../constants/api';
export function listFsp(params) {
	return new Promise((resolve, reject) => {
		axios(BANK_LIST, { params })
			.then(d => {
				resolve(d);
			})
			.catch(err => reject(err?.response?.data));
	});
}
