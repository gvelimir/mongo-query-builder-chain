var helpers = require('./helpers');

class MongoQuery {
  constructor(body = {query: {}}, keyTypePairs = []) {
    if (body.query) {
      this.body = {
        query: body.query
      };
      if (body.sort) {
        this.body['sort'] = body.sort;
      }
    } else {
      throw "Argument body does not have a supported value!";
    }

    if (Array.isArray(keyTypePairs)) {
      this.keyTypePairs = keyTypePairs;
    } else {
      throw "Argument keyTypePairs must be an array!";
    }
  }

  setKeyTypePairs(keyTypePairs = []) {
    keyTypePairs.forEach(keyTypePair => {
      if (keyTypePair.parentKey) {
        keyTypePair.keyPath.forEach(key => {
          if (!this[key]) {
            this[key] = (value, parentKeyPath = []) => {
              if (helpers.isOfPrimitiveType([keyTypePair.type], value)) {
                let subQuery = {};
                subQuery[key] = value;
                let parent = this.body.query;
                parentKeyPath.forEach(key => {
                  if (!parent[key]) {
                    parent[key] = {};
                  }
                  parent = parent[key];
                });
                parent = subQuery;
                return this;
              } else {
                throw "Value is not supported!";
              }
            };
            this[key + 'Get'] = (value = null, parentKeyPath = [key]) => {
              let currentObject = this.body.query;
              let valueToReturn = {};
              parentKeyPath.forEach(key => {
                if (!currentObject[key]) {
                  return;
                }
                currentObject = currentObject[key];
              });
              if (value) {
                if (helpers.isOfPrimitiveType([keyTypePair.type], value)) {
                  currentObject = value;
                } else {
                  throw "Value is not supported!";
                }
              }

              valueToReturn[parentKeyPath[parentKeyPath.length - 1]] = currentObject;
              return valueToReturn;
            }
          }
        });
      } else {
        keyTypePair.keyPath.forEach(key => {
          if (!this[key]) {
            this[key] = (value) => {
              if (helpers.isOfPrimitiveType([keyTypePair.type], value)) {
                this.body.query[key] = value;
                return this;
              } else {
                throw "Value is not supported!";
              }
            };

            this[key + 'Get'] = (parentKeyPath = []) => {
              let currentObject = this.body.query;
              parentKeyPath.forEach(key => {
                if (!currentObject[key]) {
                  currentObject[key] = {};
                }
                currentObject = currentObject[key];
              });
              return currentObject;
            }
          }
        });
      }
    });
    this.keyTypePairs = Array.from(new Set(keyTypePairs.concat(this.keyTypePairs)));
  }

  getValue(keyPath = []) {
    if (Array.isArray(keyPath)) {
      let value = this.body;
      keyPath.forEach(key => {
        if (helpers.isOfPrimitiveType(['string'], key)) {
          value = value[key];
        } else {
          throw "Argument keyPath contains a non string element!";
        }
      });
      return value;
    } else {
      throw "Argument keyPath must be an array!";
    }
  }

  addToQuery(keyPath = [], value) {
    if (Array.isArray(keyPath)) {
      let parent = this.body.query;
      keyPath.forEach((key, index) => {
        if (helpers.isOfPrimitiveType(['string'], key)) {
          if (!parent[key]) {
            parent[key] = {};
          }

          if (index < keyPath.length - 1) {
            parent = parent[key];
          } else {
            parent[key] = value;
          }
        } else {
          throw "Argument keyPath contains a non string element!";
        }
      });
      return this;
    } else {
      throw "Argument keyPath must be an array!";
    }
  }

  removeFromQuery(keyPath = []) {
    if (Array.isArray(keyPath)) {
      let parent = this.body.query;
      keyPath.forEach((key, index) => {
        if (helpers.isOfPrimitiveType(['string'], key)) {
          if (parent[key] === null) {
            return;
          }

          if (index === keyPath.length - 1) {
            delete parent[key];
          } else {
            parent = parent[key];
          }
        } else {
          throw "Argument keyPath contains a non string element!";
        }
      });

      return this;
    } else {
      throw "Argument keyPath must be an array!";
    }
  }

  sort(key, direction) {
    if (!helpers.isOfPrimitiveType(['string'], key)) {
      throw "Argument key must be string!";
    } else if (!helpers.isSortDirection(direction)) {
      throw "Argument direction must be either -1 or 1!";
    } else {
      if (!this.body.sort) {
        this.body['sort'] = {};
      }
      this.body.sort[key] = direction;
      return this;
    }
  }

  sortClear() {
    delete this.body.sort;
    return this;
  }

  // Comparison query operators

  $eq(value) {
    if (helpers.isOfPrimitiveType(['number', 'string'], value)) {
      return {
        $eq: value
      };
    } else {
      throw "Argument value must be string or number!";
    }
  }

  $gt(value) {
    return {
      $gt: value
    };
  }

  $gte(value) {
    return {
      $gte: value
    };
  }

  $in(value) {
    if (Array.isArray(value)) {
      return {
        $in: value
      };
    } else {
      throw "Argument value must be an array!";
    }
  }

  $ne(value) {
    if (helpers.isOfPrimitiveType(['number', 'string'], value)) {
      return {
        $ne: value
      };
    } else {
      throw "Argument value must be string or number!";
    }
  }

  $nin(value) {
    if (Array.isArray(value)) {
      return {
        $nin: value
      };
    } else {
      throw "Argument value must be an array!";
    }
  }

  $lt(value) {
    return {
      $lt: value
    };
  }

  $lte(value) {
    return {
      $lte: value
    };
  }

  // Element query operators

  $exists(value = true) {
    if (helpers.isOfPrimitiveType(['boolean'], value)) {
      return {
        $exists: value
      };
    } else {
      throw "Argument value must be boolean!";
    }
  }

  // Evaluation query operators

  $search(value) {
    if (helpers.isOfPrimitiveType(['string'], value)) {
      if (!this.body.query.$text) {
        this.body.query['$text'] = {};
      }

      this.body.query.$text['$search'] = value;
      return this.body.query.$text;
    } else {
      throw "Argument value must be string!";
    }
  }

  $searchRemove() {
    if (this.body.query.$text) {
      delete this.body.query.$text.$search;

      if (!Object.keys(this.body.query.$text).length) {
        delete this.body.query.$text;
      }
    }

    return this;
  }

  // Date query operators
  $date(value) {
    if (helpers.isOfPrimitiveType(['string'], value)) {
      return {
        $date: value
      };
    } else {
      throw "Argument value must be string!";
    }
  }
}

exports.MongoQuery = MongoQuery;
