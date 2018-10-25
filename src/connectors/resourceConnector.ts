import { ResourceStore } from '../';

export interface IResourceConnector {
  save (context?: ResourceStore | any): Promise<any>;
  fetch (context?: ResourceStore | any): Promise<any>;
}