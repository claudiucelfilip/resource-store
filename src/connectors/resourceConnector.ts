import { Resource } from '../';

export interface IResourceConnector {
  save (context: Resource<any>): Promise<any>;
  fetch (context: Resource<any>): Promise<any>;
}