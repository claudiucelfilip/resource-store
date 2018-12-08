import { IResourceOptions, IResource } from '../../src';

import { localStorageConnector } from '../../src/connectors/localStorageConnector';

import { initialState } from '../utils';
import { ResourceStore } from '../../src';


describe('localStorageConnector', () => {
  let store: ResourceStore;
  
  const resOptions: IResourceOptions = {
    connector: localStorageConnector
  };

  beforeEach(() => {
    store = new ResourceStore();
    const res1 = store.create('res-1', resOptions);
    const res2 = store.create('res-2', resOptions);
    store.add(res1);
    store.add(res2);
  });

  const nextState = {
    tracks: [4, 5, 6],
    columns: ['four', 'five', 'six']
  };

  it('should be able to fetch previously save values', async () => {
    window.localStorage.setItem('res-1', JSON.stringify(initialState))
    const res1: IResource = store.get('res-1');
    await res1.fetch();

    expect(res1.value).toEqual(initialState);
  });

  it('should be able to save new values', async () => {
    window.localStorage.setItem('res-1', JSON.stringify(initialState));
    const res1: IResource = store.get('res-1');
    await res1.fetch();
    expect(res1.value).toEqual(initialState);

    res1.update(nextState);
    await res1.save();

    const savedValue = JSON.parse(window.localStorage.getItem('res-1') as string);
    expect(res1.value).toEqual(savedValue);
  });
});