import { Observable, BehaviorSubject } from 'rxjs';
import { pluck, distinctUntilChanged, filter, skip, shareReplay, switchMap, publish } from 'rxjs/operators';
import 'rxjs/add/operator/skip';

export const symbolKey = Symbol.for('key');
export const symbolId = Symbol.for('id');

export class Resource extends BehaviorSubject<any> {

  constructor(key, data = {}) {
    super(data);
    this[symbolKey] = key;
    this[symbolId] = Math.floor((Math.random() * 1000) + 1);
  }

  public select(key: string = ''): BehaviorSubject<any> {
    if (!key) {
      return this;
    }

    const stream = new BehaviorSubject(this.value[key]);
    this.pipe(
      pluck(key),
      filter(items => items !== null && items !== undefined),
      distinctUntilChanged()
    ).subscribe(values => stream.next(values));

    const proxy = new Proxy(stream, {
      get: (target, name, receiver) => {
        if (name === 'next') {
          return this.set.bind(this, key);
        }
        return target[name];
      }
    })
    return proxy;
  }

  public set(key: string, value: any) {
    this.next(Object.assign({}, this.value, {
      [key]: value
    }));
  }
}
