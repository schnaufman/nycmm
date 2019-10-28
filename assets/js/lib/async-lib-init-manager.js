'use strict';

// static fields
let instance = null;

/**
 * Manager class to hold all async initialization promises
 * and provides a functionality for registration
 */
class AsyncLibInitManager {

  constructor() {
    this.initPromises = [];
  }

  static getInstance() {
    if (instance === null) {
      instance = new AsyncLibInitManager();
    }

    return instance;
  }

  /**
   * Clears all registered Promises
   */
  clear() {
    this.initPromises = [];
  }

  /**
   * register initialization promise
   * @param promise init promise
   */
  registerInitPromise(promise) {
    this.initPromises.push(promise);
  }

  /**
   * attach function handler after all the promises resolved
   * @param initDoneFunc handler which will be called after init done
   * @param errorFunc error handler
   */
  onInitDone(initDoneFunc, errorFunc) {
    if (this.initPromises === null || this.initPromises.length === 0) {
      return;
    }

    Promise.all(this.initPromises)
      .then(initDoneFunc)
      .catch(errorFunc);
  }
}
export { AsyncLibInitManager };
