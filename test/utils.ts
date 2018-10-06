import { Resource } from "../src";
import { BehaviorSubject } from "rxjs";

export interface DataResource extends Resource<any> {
  key: BehaviorSubject<string>;
  id: BehaviorSubject<string>;
  tracks: BehaviorSubject<number[]>;
  columns: BehaviorSubject<string[]>;
};