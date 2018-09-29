import axios from 'axios';

export const ajaxConnector: IResourceConnector = {
  fetch: () => {
    return axios.get('http://resource-test.getsandbox.com/music').then(response => response.data);
  },
  save: (key, value) => {
    if (key) {
      key = '/' + key;
    }
    return axios.post('http://resource-test.getsandbox.com/music' + key, value);
  }
};