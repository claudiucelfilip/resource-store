import { ResourceStore } from '../ResourceStore';
import { ResourceOptions, Resource } from '../resource';
import { ajaxConnector } from './connectors';
import { BehaviorSubject } from 'rxjs';
import { symbol } from '../utils';

interface DataResource extends Resource {
  key: string;
  id: BehaviorSubject<string>;
  tracks: BehaviorSubject<number[]>;
  columns: BehaviorSubject<string[]>;
};

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
    fetch: () => {
      return new Promise(resolve => setTimeout(() => resolve(nextState), 100));
    },
    save: (key, value) => {
      return new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const resOptions: ResourceOptions = {
    initialState: initialState
  };

  it('should create a BehaviorSubject stream with the initial state', async () => {
    const res1: any = new Resource('res-1', {
      initialState
    });
    expect(res1).toBeInstanceOf(BehaviorSubject);
    expect(res1.value).toEqual(resOptions.initialState);
  });

  it('should use a connector to fetch and save', async () => {
    const res1: any = new Resource('res-1', {
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

    const res1: any = new Resource('res-1', {
      connector: ajaxConnector,
      autoFetch: true
    });

    expect(fetchSpy).toBeCalled();
  });

  it('should automatically save when data has been altered is true', async () => {
    const res1: any = new Resource('res-1', {
      connector: ajaxConnector,
      autoSave: true
    });
    const saveSpy = jest.spyOn(res1, 'save');

    res1[symbol.set]('tracks', []);
    expect(saveSpy).toBeCalledWith('tracks', res1.value.tracks);

    res1[symbol.set](initialState);
    expect(saveSpy).toBeCalledWith('', res1.value);
  });

});