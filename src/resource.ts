import { BehaviorSubject } from 'rxjs';
import { pluck, distinctUntilChanged, filter, skip, shareReplay, switchMap, publish } from 'rxjs/operators';
import { symbol } from './utils';
import { IResourceConnector } from './connectors/resourceConnector';

export interface IResourceOptions {
  connector?: IResourceConnector;
  autoSave?: boolean;
  autoFetch?: boolean;
  initialState?: any;
}

export class Resource extends BehaviorSubject<any> {
  constructor(key: string, options: IResourceOptions = {}) {
    let initialState = options.initialState || {};
    super(initialState);
    this[symbol.key] = key;
    this[symbol.id] = Math.floor((Math.random() * 1000) + 1);
    this[symbol.connector] = options.connector;
    this[symbol.autoSave] = options.autoSave;
    this[symbol.autoFetch] = options.autoFetch;

    if (this[symbol.autoFetch]) {
      this.fetch();
    }
  }

  public fetch(): Promise<any> {
    if (!this[symbol.connector]) {
      throw new Error('No connector added to Resource');
    }
    return this[symbol.connector].fetch().then(response => this.next(response || null));
  }

  public save(key: string = '', value: any = this.value): Promise<any> {
    if (!this[symbol.connector]) {
      throw new Error('No connector added to Resource');
    }
    return this[symbol.connector].save(key, value);
  }

  [symbol.select] (key: string = ''): BehaviorSubject<any> {
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
          return this[symbol.set].bind(this, key);
        }
        return target[name];
      }
    })
    return proxy;
  }

  [symbol.set] (key: string, value: any = {}): Promise<any> | void {
    if (typeof key !== 'string') {
      value = key;
      key = '';
    }
    if (!key) {
      this.next(value);
      
    } else {
      this.next(Object.assign({}, this.value, {
        [key]: value
      }));
    }
  
    if (this[symbol.autoSave]) {
      return this.save(key, value);
    }
  }
}
