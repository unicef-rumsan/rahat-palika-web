import Dexie from 'dexie';

import { DB } from '../constants/db';
import { getDefaultNetwork } from '../constants/networks';

const db = new Dexie(DB.NAME);
db.version(DB.VERSION).stores({
	data: 'name,data',
	documents: 'hash,type,name,file,createdAt'
});

export default {
	save(name, data) {
		return db.data.put({ name, data });
	},

	async get(name) {
		let obj = await db.data.get(name);
		if (!obj) return null;
		return obj.data;
	},

	remove(name) {
		return db.data.delete(name);
	},

	async getProjectBalance(name, project) {
		const existingBal = await this.get(name);
		if (
			existingBal?.length > 0 &&
			existingBal.some(element => {
				if (element.project === project) {
					return true;
				}
				return false;
			})
		) {
			return existingBal.find(obj => obj.project === project);
		}
		return null;
	},

	async updateProjectBalance(name, data) {
		const existingBal = await this.get(name);
		if (
			existingBal?.length > 0 &&
			existingBal.some(element => {
				if (element.project === data[0].project) {
					return true;
				}
				return false;
			})
		) {
			const newBal = existingBal.map(obj => data?.find(o => o.project === obj.project) || obj);
			await db.data.delete(name);
			await this.save(name, newBal);
			return newBal;
		}
		return existingBal;
	},

	async setProjectBalance(name, data) {
		const existingBalance = await this.get(name);
		if (existingBalance?.length > 0) {
			const combinedArray = [...existingBalance, ...data];
			await this.save(name, combinedArray);
		} else {
			await this.save(name, data);
		}
	},

	list() {
		return db.data.toArray();
	},

	async initAppData() {
		let network = await this.getNetwork();
		let address = await this.getAddress();
		let wallet = await this.getWallet();
		return { network, address, wallet };
	},

	async clearAll() {
		await db.data.clear();
		await db.assets.clear();
		await db.documents.clear();
	},

	saveNetwork(network) {
		return this.save('network', network);
	},

	async getNetwork() {
		let network = await this.get('network');
		if (!network) return getDefaultNetwork();
		return network;
	},

	async getIpfs() {
		let ipfsUrl = await this.get('ipfsUrl');
		if (!ipfsUrl) ipfsUrl = process.env.REACT_APP_DEFAULT_IPFS;
		let ipfsDownloadUrl = await this.get('ipfsUrlDownload');
		if (!ipfsDownloadUrl) ipfsDownloadUrl = process.env.REACT_APP_DEFAULT_IPFS_DOWNLOAD;
		return { ipfsUrl, ipfsDownloadUrl };
	},

	saveIpfsUrl(ipfsUrl) {
		return this.save('ipfsUrl', ipfsUrl);
	},

	saveIpfsDownloadUrl(ipfsDownloadUrl) {
		return this.save('ipfsUrlDownload', ipfsDownloadUrl);
	},

	saveAddress(address) {
		localStorage.setItem('address', address);
		return this.save('address', address);
	},

	savePrivateKey(privateKey) {
		return this.save('privateKey', privateKey);
	},

	getAddress() {
		return this.get('address');
	},

	getAddressFromLocal() {
		return localStorage.getItem('address');
	},

	async saveWallet(wallet) {
		return this.save('wallet', wallet);
	},

	getWallet() {
		return this.get('wallet');
	},

	async saveDocuments(docs) {
		if (!Array.isArray(docs)) docs = [docs];
		return db.documents.bulkAdd(docs);
	},

	getDocument(hash) {
		return db.documents.get(hash);
	},

	async updateDocument(key, data) {
		return db.documents.update(key, data);
	},

	listDocuments() {
		return db.documents.toArray();
	}
};
