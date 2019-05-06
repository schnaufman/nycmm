'use strict';

class LeafletApi {

  constructor() {
    //properties
    //...TODO

    // we make a new Promise -> we promise a initialization of the leaflet Maps API
    this.leafletInitPromise = new Promise(
      (resolve, reject) => {
      // the executor function is called with the ability to resolve or reject the promise
        console.debug('LeafletAPI: Started promise for initialization.');
        window.leafletCallback = function () {
          resolve('Callback promise fulfilled.');
        }

        try {
          // dynamically add DOM content
          this._addLeafletApiDomContent();
        } catch (error) {
          reject(error);
        }
      }
    );

    this._addLeafletApiDomContent.leafletInitPromise.then(value => {
      console.debug('LeafletApi: ' + value);

      this._initialize();
    }).catch(reason => {
      console.error('LeafletApi: Promise failed: ' + reason)
    })
  }

  _initialize() {

  }

  _addLeafletApiDomContent() {

  }
}

export { LeafletApi };
