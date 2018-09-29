import { symbol } from './utils';
import { Resource } from './resource';


export class ResourceStore {
  private resources = {};

  constructor(resourceOptions = {}) {
    Object.keys(resourceOptions)
      .forEach((key) => {
        this.add(key, new Resource(key, resourceOptions[key]));
      });
  }

  add<T> (key: string, resource: Resource) {
    this.resources[key] = resource;
  }

  remove (key: string) {
    delete this.resources[key];
  }

  get<T> (key: string): T | any {
    const resource = this.resources[key];
    
    if (!resource) {
      throw new Error(`No resources with key ${key} was defined.`);
    }
    const proxy = new Proxy(resource, {
      get: function (target: Resource, name: string) {
        if (target[name] !== undefined) {
          if (typeof target[name] === 'function') {
            return target[name].bind(target);
          }
          return target[name];
        }

        let stream = resource[symbol.select](name);
        return stream;
      },
      set: function (target, name: string, value) {
        target.set(name, value);
        return true;
      }
    });

    return proxy;
  }
}