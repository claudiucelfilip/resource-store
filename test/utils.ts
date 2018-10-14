import { Resource } from "../src";
import { BehaviorSubject } from "rxjs";

export interface DataResource extends Resource<any> {
  key: BehaviorSubject<string>;
  id: BehaviorSubject<string>;
  tracks: BehaviorSubject<number[]>;
  columns: BehaviorSubject<string[]>;
};

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