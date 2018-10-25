# Resource-store

Small state management library based on RxJS.


resources-tore is state container designed to spread reactive state

* 

These core principles enable building components that can use the `OnPush`
change detection strategy giving you
[intelligent, performant change detection](https://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html#smarter-change-detection)
throughout your application.

## Installation

Install resource-store from npm:

`npm install @claudiucelfilip/resource-store`

## Basic Usage
```ts
import { IResourceOptions, ResourceStore, IResourceConnector, symbol, IResource } from '@claudiucelfilip/resource-store';

class SimpleConnector implements IResourceConnector {
  save (context?: ResourceStore | any): Promise<any> {
    return // Promise to sync with external store
  }
  fetch (context?: ResourceStore | any): Promise<any> {
    return // Promise to fetch from external store
  }
}

const store: ResourceStore = new ResourceStore();
const options1: IResourceOptions = {
  initialState: {
    items: [],
    text: 'string text',
    value: 4,
    obj1: {
      obj2: {
        label: 'string label',
        value: 'string label2'
      }
    }
  }
};

const options2: IResourceOptions = {
  connector: new SimpleConnector,
  autoFetch: false,
  autoSave: true
};

const resourceOne: IResource = store.create('resource-one', options1);
store.create('resource-two', options2);

resourceOne.value; // access to the current state of the resource (inherited from BehaviorSubject)

resourceOne.text.value === resourceOne.value.text;
resourceOne.value$.value === 4; // appending $ to any property name will assure that it doesn't conflict with any other Resource

resourceOne.obj1.obj2.update({
  label: 'new string label'
}); // will only update the label property from obj2. This change event will bubble through the tree

resourceOne[symbol.id]; // nonconflicting access to unique id
resourceOne[symbol.key]; // nonconflicting accesto to defined key (ie. 'resource-one')

const resourceTwo: IResource = store.get('resource-two');
resourceTwo.newProperty instanceof BehaviorSubject;  // will generate a new empty observable
resourceTwo.fetch();

resourceTwo.next({
  property1: 'new value'
}); // setting autoSave: true, atomatically triggers resourceTwo.save()


```
The store creates enhanced RxJS `BehaviorSubject` proxies which can:
* accessing any property on the resource creates new observables (eg. `resourceOne.text instanceof BehaviorSubject`). These are created and cached, on-demand on any level.
* `resourceOne.obj1.obj2.next(newState)` replaces value with a new one and bubbles up the object tree
* `resourceOne.text.update({
  text: 'string text2'
})` will only replace the `text` property
* all other `BehaviorSubject` functionality applies
* `fetch` and `save` will sync resource with an external store via a `ResourceConnector`

## Configuration Options
The 'ResourceOptions' can have the following properties
* `connector` - attaches ` ResourceConnector` instance to be used to persist state (eg. DB, LocalStorage, etc.)
* `autoFetch` - (boolean, default: false) automatically calls the `fetch` method on Connector
* `autoSave` - (boolean, default: false) any call to `next` or `update` will atomatically call the `save` method on the `ResourceConnector`
* `initialState` - sets the initial state for the resource
