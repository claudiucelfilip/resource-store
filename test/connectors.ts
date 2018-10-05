import { IResourceConnector } from '../src';
export const ajaxConnector: IResourceConnector = {
	fetch: () => {
		return Promise.resolve({});
	},
	save: (key, value) => {
		if (key) {
			key = '/' + key;
		}
		return Promise.resolve({});
	}
};