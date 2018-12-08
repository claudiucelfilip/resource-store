import { IResource } from "../src";
import { BehaviorSubject } from "rxjs";

export interface DataResource extends IResource {
  key: any;
  id: IResource;
  tracks: IResource;
  columns: IResource;
  foo: FooResource;
  bar: IResource;
};

interface FooResource extends IResource {
  bar: BarResource1;
}

interface FooResource1 extends IResource {
  bar1: BarResource;
}

interface BarResource extends IResource {
  foo: FooResource1;
}

interface BarResource1 extends IResource {
  foo1: FooResource1;
}

export const initialState = {
  key: '',
  id: '',
  tracks: [1, 2, 3],
  columns: ['one', 'two', 'three'],
  value: 'conflicting value',
  foo: {
    label: 'foo',
    value: 'foo conflicting value',
    bar: {
      label: 'bar',
      foo1: {
        label: 'foo1',
        bar1: {
          label: 'bar1',
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
      bar1: {
        label: '-bar1',
        foo1: {
          label: '-foo1'
        }
      }
    }
  }
};