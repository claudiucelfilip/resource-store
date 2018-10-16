import { ResourceStore } from '../src';
import { IResourceOptions, Resource } from '../src';
import { BehaviorSubject } from 'rxjs';
import { symbol } from '../src';
import { DataResource, initialState } from './utils';

describe('ResourceStore', () => {
  let store: ResourceStore;
  
  let res1Ref, res2Ref;

  beforeEach(() => {
    const resOptions: IResourceOptions = {
      initialState
    };

    store = new ResourceStore();
    const res1 = new Resource<DataResource>('res-1', resOptions);
    const res2 = new Resource<DataResource>('res-2', resOptions);
    store.add(res1);
    store.add(res2);
    res1Ref = res1;
    res2Ref = res2;
  });

  it('should be able to create new resource', async () => {
    const res3 = store.create('res-3', {
      initialState
    });
    expect(res3).toBeTruthy();
    expect(res3.value).toEqual(initialState);
  });
  
  it('should get different resources by keys', async () => {
    const res1 = store.get('res-1');
    const res2 = store.get('res-2');
    const res1copy = store.get('res-1');
    
    expect(res1).toBeTruthy();
    expect(res2).toBeTruthy();

    expect(res1[symbol.id]).not.toEqual(res2[symbol.id]);
    expect(res1[symbol.id]).toEqual(res1copy[symbol.id]);
  });

  it('should get different resources by resource instance', async () => {
    const res1 = store.get(res1Ref);
    const res2 = store.get(res2Ref);
    const res1copy = store.get(res1Ref);

    expect(res1).toBeTruthy();
    expect(res2).toBeTruthy();

    expect(res1[symbol.id]).not.toEqual(res2[symbol.id]);
    expect(res1[symbol.id]).toEqual(res1copy[symbol.id]);
  });

  it('should be able to retrieve store key from a stream', async () => {
    const res1 = store.get('res-1');
    expect(res1.tracks.key).toEqual('res-1');
  });

  it('should be able to retrieve parent store from a stream', async () => {
    const res1 = store.get('res-1');
    expect(res1.tracks.parent[symbol.key]).toEqual('res-1');
  });

  it('should throw error for non-existing key', async () => {
    expect(store.get.bind('res-non-existing')).toThrow(Error);
  });

  it('should return streams for each resource key with the initial states of each', async () => {
    const res1 = store.get('res-1');

    expect(res1.value).toEqual(initialState);
    expect(res1.key.value).toEqual(initialState.key);
    expect(res1.id.value).toEqual(initialState.id);
    expect(res1.tracks.value).toEqual(initialState.tracks);
    expect(res1.columns.value).toEqual(initialState.columns);
  });

  it('should access value for each resource method: fetch, save, pipe, subscribe, complete', async () => {
    const res1 = store.get('res-1');
    expect(res1.fetch).toBeInstanceOf(Function);
    expect(res1.save).toBeInstanceOf(Function);
    expect(res1.pipe).toBeInstanceOf(Function);
    expect(res1.subscribe).toBeInstanceOf(Function);
    expect(res1.complete).toBeInstanceOf(Function);
  });

  it('should return the data property instead of resource (eg. key/id should be a stream insted of resources\'s key/id prop', async () => {
    const res1 = store.get('res-1');
    expect(res1.key).toBeInstanceOf(BehaviorSubject);
    expect(res1.key.value).toEqual(initialState.key);
    expect(res1[symbol.key]).toEqual('res-1');

    expect(res1.id).toBeInstanceOf(BehaviorSubject);
    expect(res1.id.value).toEqual(initialState.id);
    expect(res1[symbol.id]).toBeDefined();
  });

  it('should create stores at any object level', () => {
    const res1: any = store.get('res-1');
    expect(res1).toBeInstanceOf(BehaviorSubject);
    
    expect(res1.foo).toBeInstanceOf(BehaviorSubject);
    expect(res1.foo.value).toEqual(initialState.foo);

    expect(res1.foo.bar).toBeInstanceOf(BehaviorSubject);
    expect(res1.foo.bar.value).toEqual(initialState.foo.bar);

    expect(res1.foo.bar.foo1).toBeInstanceOf(BehaviorSubject);
    expect(res1.foo.bar.foo1.value).toEqual(initialState.foo.bar.foo1);

    expect(res1.foo.bar.foo1.bar1).toBeInstanceOf(BehaviorSubject);
    expect(res1.foo.bar.foo1.bar1.value).toEqual(initialState.foo.bar.foo1.bar1);
  });

  it('should cache previously created store', () => {
    const res1: any = store.get('res-1');
    const res2: any = store.get('res-1');
    const res22: any = store.get('res-2');

    const foo1 = res1.foo;
    const foo2 = res1.foo;
    const bar1 = res1.foo.bar1;
    const bar2 = res1.foo.bar1;
    const bar22 = res22.foo.bar1;
    
    expect(res1[symbol.id]).toEqual(res2[symbol.id]);
    expect(res1.foo[symbol.id]).toEqual(res2.foo[symbol.id]);

    expect(foo1[symbol.id]).toEqual(foo2[symbol.id]);
    expect(bar1[symbol.id]).toEqual(bar2[symbol.id]);
    expect(bar22[symbol.id]).not.toEqual(bar2[symbol.id]);
  });

  it('should bypass any resource property by appending $ sign to the peroperty', () => {
    const res1: any = store.get('res-1');

    expect(res1.value$).toBeInstanceOf(BehaviorSubject);
    expect(res1.value).toEqual(initialState);

    expect(res1.foo.value$).toBeInstanceOf(BehaviorSubject);
    expect(res1.foo.value).toEqual(initialState.foo);
  });

  it('should update specific properties using update', () => {
    const res1: any = store.get('res-1');
    const newResLabel = 'res-label';
    const newBarLabel = 'baaar';
    const newFooLabel = 'foooo';

    expect(res1.value).toEqual(initialState);
    expect(res1.foo.value).toEqual(initialState.foo);
    expect(res1.foo.value.label).toEqual(initialState.foo.label);

    expect(res1.foo.bar.value).toEqual(initialState.foo.bar);
    expect(res1.foo.bar.value.label).toEqual(initialState.foo.bar.label);

    res1.update({
      label: newFooLabel
    });
    res1.foo.update({
      label: newFooLabel
    });
    res1.foo.bar.update({
      label: newBarLabel
    });

    expect(res1.value).not.toEqual(initialState);
    expect(res1.foo.value.label).toEqual(newFooLabel);
    expect(res1.foo.bar.value.label).toEqual(newBarLabel);
  });

});