import { Resource } from './resource';
import { BehaviorSubject } from 'rxjs';
import { Resources } from './resources';

export function resourceFactory <T>(key: string): BehaviorSubject<T> | any {
  const resource = Resources.get(key) || new Resource(key);
  Resources.add(key, resource);

  const proxy = new Proxy(resource, {
    get: function (target, name: string, receiver) {
      if (target[name] !== undefined) {
        if (typeof target[name] === 'function') {
          return target[name].bind(target);  
        }
        return target[name];
      }
      let stream = target.select(name);
      return stream;
    },
    set: function(target, name: string, value) {
      target.set(name, value);
      return true;
    }
  });
  return proxy;

}
