import axios from 'axios';
import { IResourceConnector } from './resourceConnector';

export const localStorageConnector: IResourceConnector = {
  fetch(key: string) {
    let data = localStorage.getItem(key);
    data = (data && JSON.parse(data));
    return Promise.resolve(data);
  },
  save(key: string, value) {
    localStorage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  }
};