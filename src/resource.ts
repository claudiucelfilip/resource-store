import { BehaviorSubject } from 'rxjs';
import { pluck, distinctUntilChanged, filter, skip, shareReplay, switchMap, publish } from 'rxjs/operators';
import { symbol } from './utils';
import { IResourceOptions, IResource } from '.';


export class Resource extends BehaviorSubject<any> implements IResource {
  
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

  public fetch(options = this): Promise<any> {
    if (!this[symbol.connector]) {
      throw new Error('No connector added to Resource');
    }
    return this[symbol.connector]
      .fetch(options)
      .then(response => {
        this.next(Object.assign({}, this.value, response));
      });
  }

  // public next(...args) {
  //   let output = BehaviorSubject.prototype.next.call(this, ...args);
  //   if (this[symbol.autoSave]) {
  //     this.save();
  //   }
  //   return output;
  // }

  public save(options = this): Promise<any> {
    if (!this[symbol.connector]) {
      throw new Error('No connector added to Resource');
    }
    return this[symbol.connector].save(options);
  }

  [symbol.select] (key: string = ''): BehaviorSubject<any> {
    if (!key) {
      return this;
    }

    const compoundKey = `${this[symbol.key]}.${key}`;
    const stream = new Resource(compoundKey, {
      initialState: this.value[key]
    });
    this.pipe(
      pluck(key),
      filter(items => items !== null && items !== undefined),
      distinctUntilChanged()
    ).subscribe(values => stream.next(values));

    const proxy = new Proxy(stream, {
      get: (target, name: string) => {
        switch(name) {
          case 'next': return this[symbol.set].bind(this, key);
          case 'key': return this[symbol.key];
          case 'parent': return target;
          default: return target[name];
        }
      },
      set: (target: any, name: any, value: any) => {
        target[symbol.select](name).next(value);
        return true;
      }
    })
    return proxy;
  }
  update (value: any = {}): void {
    const key = '';
    return this[symbol.set](key, {...this.value[key], ...value});
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
      return this.save();
    }
  }

  dispatch(action) {
    return action(this);
  }
}
