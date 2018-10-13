import { IResourceOptions, Resource, IResourceConnector } from '../src';
import { BehaviorSubject } from 'rxjs';
import { symbol } from '../src';
import { DataResource } from './utils';


describe('Resource', () => {
  const initialState = {
    key: 'state-key',
    id: 0,
    tracks: [1, 2, 3],
    columns: ['one', 'two', 'three']
  };

  const nextState = {
    tracks: [4, 5, 6],
    columns: ['four', 'five', 'six']
  };

  const ajaxConnector: IResourceConnector = {
    fetch: (resource) => {
      return new Promise(resolve => setTimeout(() => resolve(nextState), 100));
    },
    save: (resource) => {
      return new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const resOptions: IResourceOptions = {
    initialState: initialState
  };

  it('should create a BehaviorSubject stream with the initial state', async () => {
    const res1: any = new Resource<DataResource>('res-1', {
      initialState
    });
    expect(res1).toBeInstanceOf(BehaviorSubject);
    expect(res1.value).toEqual(resOptions.initialState);
  });
  
  it('should use a connector to fetch and save', async () => {
    const res1: any = new Resource<DataResource>('res-1', {
      connector: ajaxConnector
    });

    const fetchSpy = jest.spyOn(res1, 'fetch');
    const saveSpy = jest.spyOn(res1, 'save');
    await res1.fetch();
    await res1.save();

    expect(fetchSpy).toBeCalled();
    expect(saveSpy).toBeCalled();
    expect(res1.value).toEqual(nextState);

  });


  it('should automatically fetch data on creation if autoFetch is true', async () => {
    const fetchSpy = jest.spyOn(Resource.prototype, 'fetch');

    const res1: any = new Resource<DataResource>('res-1', {
      connector: ajaxConnector,
      autoFetch: true
    });

    expect(fetchSpy).toBeCalled();
  });

  it('should automatically save when data has been altered is true', async () => {
    const res1: any = new Resource<DataResource>('res-1', {
      connector: ajaxConnector,
      autoSave: true
    });
    const saveSpy = jest.spyOn(res1, 'save');

    res1[symbol.set]('tracks', []);
    expect(saveSpy).toBeCalled();

    res1[symbol.set](initialState);
    expect(saveSpy).toBeCalled();
  });

});