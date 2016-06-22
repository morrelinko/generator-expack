'use strict';

function Bag(items) {
  this._items = {};
  this._length = 0;

  if (items) {
    Object.keys(items).forEach(key => this.add(key, items[key]));
  }
}

Bag.prototype = {
  add(key, val) {
    if (!this.exists(key)) {
      this._items[key] = [];
    }

    this._items[key].push(val);
    this._length += 1;
  },

  /**
   * Get all of the messages for a given key.
   * @param key
   */
  get(key) {
    if (this.exists(key)) {
      return this._items[key];
    }

    return [];
  },

  /**
   * Get the first message from the bag for a given key.
   * @param key
   * @returns {string}
   */
  first(key) {
    let msgs = key ? this.get(key) : this.all();
    return msgs.length > 0 ? msgs[0] : '';
  },

  exists(key) {
    return key in this._items;
  },

  /**
   * Checks if messages exist for a given key.
   * @param key
   */
  has(key) {
    return this.first(key) !== '';
  },

  any() {
    return this.count() > 0;
  },

  count() {
    return this._length;
  },

  empty() {
    return !this.any();
  },

  /**
   * Get all of the messages for every key in the bag flattened.
   * @returns {{}|*}
   */
  all() {
    let messages = [];
    Object.keys(this._items).forEach(key => {
      messages = messages.concat(this._items[key]);
    });

    return messages;
  },

  items() {
    return this._items;
  }
};

module.exports = Bag;
