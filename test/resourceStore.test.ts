import { ResourceStore } from '../ResourceStore';
import { ResourceOptions, Resource } from '../resource';
import { BehaviorSubject } from 'rxjs';
import { symbol } from '../utils';

interface DataResource extends Resource {
  key: BehaviorSubject<string>;
  id: BehaviorSubject<string>;
  tracks: BehaviorSubject<number[]>;
  columns: BehaviorSubject<string[]>;
};

describe('ResourceStore', () => {
  let store: ResourceStore;
  const initialState = {
    key: '',
    id: '',
    tracks: [1, 2, 3],
    columns: ['one', 'two', 'three']
  };

  beforeEach(() => {
    const resOptions: ResourceOptions = {
      initialState
    };

    store = new ResourceStore({
      'res-1': resOptions,
      'res-2': resOptions
    });

  });

  it('should get different resources for different keys', async () => {
    const res1 = store.get<DataResource>('res-1');
    const res2 = store.get<DataResource>('res-2');
    
    expect(res1).toBeTruthy();
    expect(res2).toBeTruthy();

    expect(res1[symbol.id]).not.toEqual(res2[symbol.id]);
  });

  it('should get different resources for different keys', async () => {
    const res1 = store.get<DataResource>('res-1');
    const res2 = store.get<DataResource>('res-1');
    expect(res1).toBeTruthy();
    expect(res2).toBeTruthy();

    expect(res1[symbol.id]).toEqual(res2[symbol.id]);
  });


  it('should throw error for non-existing key', async () => {
    expect(store.get.bind('res-non-existing')).toThrow(Error);
  });

  it('should return streams for each resource key with the initial states of each', async () => {
    const res1 = store.get<DataResource>('res-1');

    expect(res1.value).toEqual(initialState);
    expect(res1.key.value).toEqual(initialState.key);
    expect(res1.id.value).toEqual(initialState.id);
    expect(res1.tracks.value).toEqual(initialState.tracks);
    expect(res1.columns.value).toEqual(initialState.columns);
  });

  it('should access value for each resource method: fetch, save, pipe, subscribe, complete', async () => {
    const res1 = store.get<DataResource>('res-1');
    expect(res1.fetch).toBeInstanceOf(Function);
    expect(res1.save).toBeInstanceOf(Function);
    expect(res1.pipe).toBeInstanceOf(Function);
    expect(res1.subscribe).toBeInstanceOf(Function);
    expect(res1.complete).toBeInstanceOf(Function);
  });

  it('should return the data property instead of resource (eg. key/id should be a stream insted of resources\'s key/id prop', async () => {
    const res1 = store.get<DataResource>('res-1');
    expect(res1.key).toBeInstanceOf(BehaviorSubject);
    expect(res1.key.value).toEqual(initialState.key);
    expect(res1[symbol.key]).toEqual('res-1');

    expect(res1.id).toBeInstanceOf(BehaviorSubject);
    expect(res1.id.value).toEqual(initialState.id);
    expect(res1[symbol.id]).toBeDefined();

  });

});