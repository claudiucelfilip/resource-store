// Import stylesheets
import './style.css';
import { resourceFactory } from './resourceFactory';
import { Resource } from './resource';
import { Observable, BehaviorSubject } from 'rxjs';

export class IResource extends Resource {
  key: string;
  id: BehaviorSubject<string>;
  tracks: BehaviorSubject<number[]>;
  columns: BehaviorSubject<string[]>;
}

var res1: IResource = resourceFactory<IResource>('res-1');
var res2: IResource = resourceFactory<IResource>('res-1');

res1.tracks.next([1,2,3]);
res1.columns.next(['a', 'b', 'c', 'd']);


console.log('--------------');
console.log('res1', res1);
console.log('res1.key', res1.key);
console.log('res1[key]', res1[Symbol.for('key')]);
console.log('res2[key]', res2[Symbol.for('key')]);
console.log('res1.id', res1.id);
console.log('res1[id]', res1[Symbol.for('id')]);
console.log('res2[id]', res2[Symbol.for('id')]);
console.log('res1.value', res1.value);
console.log('res1.tracks.value', res1.tracks.value);
res1.subscribe(value => console.log('res1.subscribe', value));
res1.tracks.subscribe(value => console.log('res1.tracks.subscribe', value));

res1.next({
  tracks: [1,2,3,4],
  columns: ['a', 'b', 'c', 'd', 'e']
});
