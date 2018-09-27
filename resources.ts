export class Resources {
  private static res = [];

  static add(key, resource) {
    Resources.res[Symbol.for(key)] = resource;
  }

  static remove(key) {
    delete Resources.res[Symbol.for(key)];
  }

  static get(key) {
    return Resources.res[Symbol.for(key)];
  }
}