import { IResourceConnector } from './resourceConnector';
import { symbol } from '..';

export const localStorageConnector: IResourceConnector = {
  fetch(resource) {
    let data = localStorage.getItem(resource[symbol.key]);
    data = (data && JSON.parse(data));
    return Promise.resolve(data);
  },
  save(resource) {
    localStorage.setItem(resource[symbol.key], JSON.stringify(resource.value));
    return Promise.resolve();
  }
};