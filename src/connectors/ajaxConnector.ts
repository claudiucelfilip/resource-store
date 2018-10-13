import axios from 'axios';
import { IResourceConnector } from './resourceConnector';
import { symbol } from '..';

export const ajaxConnector: IResourceConnector = {
  fetch: (resource) => {
    return axios.get('http://resource-test.getsandbox.com/music').then(response => response.data);
  },
  save: (resource) => {
    let key = resource[symbol.key];
    if (key) {
      key = '/' + key;
    }
    return axios.post('http://resource-test.getsandbox.com/music' + key, resource.value);
  }
};