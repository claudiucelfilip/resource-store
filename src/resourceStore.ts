import { symbol } from './utils';
import { Resource } from './resource';


export class ResourceStore {
  private resources = {};

  constructor() {}

  add (resource: Resource<any>) {
    this.resources[resource[symbol.key]] = resource;
  }

  remove (key: string) {
    delete this.resources[key];
  }

  get (key: string | Resource<any>) {
    let resource;

    if (typeof key === 'string') {
      resource = this.resources[key as string];
    } else {
      resource = Object.keys(this.resources)
        .map(key => this.resources[key])
        .find(resource => resource === key);
    }
    
    if (!resource) {
      throw new Error(`No resource with key ${key} was defined.`);
    }
    const proxy = new Proxy(resource, {
      get: function (target: Resource<any>, name: string) {
        if (target[name] !== undefined) {
          if (typeof target[name] === 'function') {
            return target[name].bind(target);
          }
          return target[name];
        }

        let stream = resource[symbol.select](name);
        return stream;
      }
    });

    return proxy;
  }
}