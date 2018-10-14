import {
  Resource,
  IResourceOptions,
  ResourceStore,
  columns,
  getRandom,
  ajaxConnector,
  localStorageConnector,
  ResourceSubject
} from './src';
import { BehaviorSubject } from 'rxjs';
import { map, share, shareReplay } from 'rxjs/operators';

// interface any extends Resource<any> {
//   key: ResourceSubject<string>;
//   id: ResourceSubject<string>;
//   tracks: ResourceSubject<number[]>;
//   columns: ResourceSubject<string[]>;

// };

const resOptions: IResourceOptions = {
  connector: localStorageConnector,
  // autoSave: true,
  // autoFetch: true,
  initialState: {
    tracks: [],
    value: 'conflicting value',
    foo: {
      label: 'foo',
      bar: {
        label: 'bar',
        foo1: {
          label: 'foo1',
          bar2: {
            label: 'bar2',
            foo2: {
              label: 'foo2'
            }
          }
        }
      }
    },
    bar: {
      label: '-bar',
      foo: {
        label: '-foo',
        bar2: {
          label: '-bar2',
          foo2: {
            label: '-foo2'
          }
        }
      }
    }
  }
};

const resourceStore = new ResourceStore();

const res1 = new Resource<any>('res-1', resOptions);
const res2 = new Resource<any>('res-2', resOptions);

resourceStore.add(res1);
resourceStore.add(res2);


async function init () {
  const res1: any = resourceStore.get('res-1');
  const res2: any = resourceStore.get('res-2');

  console.log('--------------');
  console.log('res1.key', res1.key);
  console.log('res1[key]', res1[Symbol.for('key')]);
  console.log('res2[key]', res2[Symbol.for('key')]);
  console.log('res1.id', res1.id);
  console.log('res1[id]', res1[Symbol.for('id')]);
  console.log('res2[id]', res2[Symbol.for('id')]);
  console.log('#1 res1.value', res1.value);

  console.log('#1 res1.tracks.value', res1.tracks.value);
  console.log('#1 res1.tracks.key', res1.tracks.key);
  console.log('#1 res1.tracks.parent', res1.tracks.parent);
  console.log('#1 res1.columns.value', res1.columns.value);

  console.log('-------------');
  res1.subscribe(value => console.log('res1.subscribe', value));
  res1.tracks.subscribe(value => console.log('res1.tracks.subscribe', value));
  res1.columns.subscribe(value => console.log('res1.columns.subscribe', value));

  res1.tracks.next([getRandom(1000), getRandom(1000), getRandom(1000)]);
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
function init2 () {
  const res1: any = resourceStore.get('res-1');

  res1.subscribe(value => console.log('res1.subscribe', value));
  res1.foo.subscribe(value => console.log('res1.foo.subscribe', value));
  res1.foo.bar.subscribe(value => console.log('res1.foo.bar.subscribe', value));
  res1.foo.bar.foo2.subscribe(value => console.log('res1.foo.bar.foo2.subscribe', value));

  res1.bar.subscribe(value => console.log('res1.bar.subscribe', value));

  console.log('res1.value', res1.value);
  console.log('res1.foo.value', res1.foo.value);
  console.log('res1.foo.bar.value', res1.foo.value);

  console.log('res1.bar.value', res1.bar.value);
  console.log('res1.bar.foo.value', res1.bar.foo.value);


  console.log('--------------');
  res1.foo.next({
    ...res1.foo.value, ...{
      label: 'fooo'
    }
  });
  res1.foo.update({ label: 'fooo00' });


  res1.foo.bar.next({
    ...res1.foo.bar.value, ...{
      label: 'baar'
    }
  });

  res1.foo.bar.update({ label: 'baar00' });

  res1.bar.next({
    ...res1.bar.value, ...{
      label: '-baar'
    }
  });

  console.log('res1.foo.bar.value', res1.foo.bar.value);
  console.log('res1.foo.bar.foo1.value', res1.foo.bar.foo1.value);
  console.log('--------------');

  res1.foo.bar.foo1.update({
    label: 'foooooo1'
  });

  res1.foo.bar.foo1.bar2.foo2.update({
    label: 'foooooo2'
  });
}

function init3 () {
  const res1: any = resourceStore.get('res-1');

  console.log('res1.value', res1.value);
  console.log('res1.value$', res1.value$);
  console.log('res1.value$.value', res1.value$.value);
}


function init4 () {
  const res1: any = resourceStore.get('res-1');

  res1.subscribe(value => console.log('#1 res1.subscribe', value));
  res1.foo.subscribe(value => console.log('#1 res1.foo.subscribe', value));

  res1.subscribe(value => console.log('#2 res1.subscribe', value));
  res1.foo.subscribe(value => console.log('#2 res1.foo.subscribe', value));

  console.log('--------------');

  res1.foo.update({
    label: 'foooo'
  });

  console.log('--------------');
  let fooAlt = res1.foo.pipe(
    
    map((foo: any) => {
      console.log('toUpperCase');
      return {
        ...foo, ...{
          label: foo.label.toUpperCase()
        }
      };
    }),
    shareReplay()
  );

  

  fooAlt.subscribe(value => console.log('#1 fooAlt.subscribe', value));
  fooAlt.subscribe(value => console.log('#2 fooAlt.subscribe', value));

  res1.foo.update({
    label: 'foooo2'
  });
}
// init();
// init2();
// init3();

init4();
