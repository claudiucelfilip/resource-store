import { symbol } from './utils';
import { Resource } from './resource';
import { IResource } from '.';

export class ResourceStore {
  private stores = {};

  constructor() { }

  add(resource: Resource): IResource {
    const store: IResource = this.makeStore(resource);
    this.stores[resource[symbol.key]] = store;
    return store;
  }

  create(key: string, options?): IResource {
    return this.add(new Resource(key, options));
  }

  addStore(store: ProxyHandler<any>) {
    this.stores[store[symbol.key]] = store;
  }

  remove(key: string) {
    delete this.stores[key];
  }

  makeStore(resource: Resource) {
    let store = new Proxy(resource, {
      get: (target: Resource, name: string) => {

        if (name === 'dispatch') {
          return target[name].bind(this.get(target));
        }

        if (target[name] !== undefined) {
          if (typeof target[name] === 'function') {
            return target[name].bind(target);
          }
          return target[name];
        }

        if (typeof name === 'symbol') {
          return target[name];
        }

        name = name.replace(/\$$/, '');
        const compoundKey = (`${target[symbol.key]}.${name}`);
        return this.get(compoundKey, true) || this.makeStore(resource[symbol.select](name)); //this.get(resource[symbol.select](name));
      }
    });

    this.addStore(store);
    return store;
  }

  get(keyResource: string | Resource, dontThrow = false): IResource {
    let key: string = keyResource[symbol.key] || keyResource;
    let resource = this.stores[key];

    if (!resource && !dontThrow) {
      throw new Error(`No resource with key ${key[symbol.key] || key} was defined.`);
    }

    return resource;
  }
}