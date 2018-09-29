// Import stylesheets
import { Resource, ResourceOptions } from './resource';
import { ResourceStore } from './resourceStore';
import { BehaviorSubject } from 'rxjs';
import { columns, getRandom } from './utils';
import { ajaxConnector } from './ajaxConnector';

export interface TrackData extends Resource {
  key: BehaviorSubject<string>;
  id: BehaviorSubject<string>;
  tracks: BehaviorSubject<number[]>;
  columns: BehaviorSubject<string[]>;
};



const resOptions: ResourceOptions = {
  connector: ajaxConnector,
  autoSave: true,
  autoFetch: true,
  initialState: {
    tracks: []
  }
};
const resourceStore = new ResourceStore({
  'res-1': resOptions,
  'res-2': resOptions
});

async function init() {
  const res1: TrackData = resourceStore.get<TrackData>('res-1');
  const res2: TrackData = resourceStore.get<TrackData>('res-2');

  
  console.log('--------------');
  console.log('res1.key', res1.key);
  console.log('res1[key]', res1[Symbol.for('key')]);
  console.log('res2[key]', res2[Symbol.for('key')]);
  console.log('res1.id', res1.id);
  console.log('res1[id]', res1[Symbol.for('id')]);
  console.log('res2[id]', res2[Symbol.for('id')]);
  console.log('#1 res1.value', res1.value);
  console.log('#1 res1.tracks.value', res1.tracks.value);
  console.log('#1 res1.columns.value', res1.columns.value);

  
  console.log('-------------');
  res1.subscribe(value => console.log('res1.subscribe', value));
  res1.tracks.subscribe(value => console.log('res1.tracks.subscribe', value));
  res1.columns.subscribe(value => console.log('res1.columns.subscribe', value));

  
  res1.tracks.next([getRandom(1000), getRandom(1000) , getRandom(1000)]);
  res1.columns.next([
    columns[getRandom(columns.length)],
    columns[getRandom(columns.length)],
    columns[getRandom(columns.length)]
  ]);


  console.log('#2 res1.value', res1.value);
  console.log('#2 res1.tracks.value', res1.tracks.value);
  console.log('#2 res1.columns.value', res1.columns.value);

  res1.save();
}

init();