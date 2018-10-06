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

  get (key: string) {
    const resource = this.resources[key];
    
    if (!resource) {
      throw new Error(`No resources with key ${key} was defined.`);
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