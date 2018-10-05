export interface IResourceConnector {
  save(key: string, value: any): Promise<any>;
  fetch(key: string): Promise<any>;
}