import axios from 'axios';

export const ajaxConnector: IResourceConnector = {
	fetch: () => {
		return Promise.resolve({});
	},
	save: (key, value) => {
		if (key) {
			key = '/' + key;
		}
		return axios.post('http://resource-test.getsandbox.com/music' + key, value);
	}
};