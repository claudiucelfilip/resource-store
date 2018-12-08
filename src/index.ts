// export stylesheets
// export * from './resource';
export * from './resourceStore';
export * from './utils';
export * from './connectors/ajaxConnector';
export * from './connectors/localStorageConnector';
export * from './connectors/resourceConnector';
import { IResourceConnector } from './connectors/resourceConnector';
import { BehaviorSubject } from 'rxjs';

export interface IResourceOptions {
  connector?: IResourceConnector;
  autoSave?: boolean;
  autoFetch?: boolean;
  initialState?: any;
}

export interface IResource extends IResourceConnector, BehaviorSubject<any> {
  update (value: any): void;
  parent?: IResource;
  key?: string;
}