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

  hasKey(keyPath = []) {
    if (Array.isArray(keyPath)) {
      let value = this.body.query;
      keyPath.forEach(key => {
        if (!value) {
          return false;
        }
        value = value[key];
      });
      return !!value;
    } else {
      throw "Argument keyPath must be an array!";
    }
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

  addToQuery(keyPath = [], value, merge = false) {
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
            if (merge) {
              if (!helpers.isOfPrimitiveType(['object'], value)) {
                throw "Argument value must be object!";
              }
              parent[key] = Object.assign(parent[key], value);
            } else {
              parent[key] = value;
            }
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

  clause(key, value) {
    if (!helpers.isOfPrimitiveType(['string'], key)) {
      throw "Argument key must be string!";
    }

    if (!helpers.isOfPrimitiveType(['number', 'string'], value)) {
      throw "Argument value must be string or number!";
    }

    let clause = {};
    clause[key] = value;

    return clause;
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

  sort(key, direction = 1) {
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

  static $eq(value) {
    if (helpers.isOfPrimitiveType(['number', 'string'], value)) {
      return {
        $eq: value
      };
    } else {
      throw "Argument value must be string or number!";
    }
  }

  static $gt(value) {
    return {
      $gt: value
    };
  }

  static $gte(value) {
    return {
      $gte: value
    };
  }

  static $in(value) {
    if (Array.isArray(value)) {
      return {
        $in: value
      };
    } else {
      throw "Argument value must be an array!";
    }
  }

  static $ne(value) {
    if (helpers.isOfPrimitiveType(['number', 'string'], value)) {
      return {
        $ne: value
      };
    } else {
      throw "Argument value must be string or number!";
    }
  }

  static $nin(value) {
    if (Array.isArray(value)) {
      return {
        $nin: value
      };
    } else {
      throw "Argument value must be an array!";
    }
  }

  static $lt(value) {
    return {
      $lt: value
    };
  }

  static $lte(value) {
    return {
      $lte: value
    };
  }

  // Element query operators

  static $exists(value = true) {
    if (helpers.isOfPrimitiveType(['boolean'], value)) {
      return {
        $exists: value
      };
    } else {
      throw "Argument value must be boolean!";
    }
  }

  // Evaluation query operators

  static $language(value = 'none') {
    if (!helpers.isOfPrimitiveType(['string'], value)) {
      throw "Argument value must be string!";
    }

    let textObject = {
      $text: {}
    };
    textObject.$text.$language = value;
    return textObject;
  }

  $languageRemove(textClauseLocation = []) {
    if (!Array.isArray(textClauseLocation)) {
      throw "Argument keyPath must be an array!";
    }
    let parent = this.body.query;
    textClauseLocation.forEach(key => {
      if (helpers.isOfPrimitiveType(['string'], key)) {
        if (parent[key] === null) {
          return;
        }
        parent = parent[key];
      } else {
        throw "Argument keyPath contains a non string element!";
      }
    });

    let textClause = parent.$text;
    if (textClause) {
      delete textClause.$language;
    }

    return this;
  }

  static $search(value) {
    if (!helpers.isOfPrimitiveType(['string'], value)) {
      throw "Argument value must be string!";
    }

    let textObject = {
      $text: {}
    };
    textObject.$text.$search = value;
    return textObject;
  }

  $searchRemove(textClauseLocation = []) {
    if (!Array.isArray(textClauseLocation)) {
      throw "Argument keyPath must be an array!";
    }
    let parent = this.body.query;
    textClauseLocation.forEach(key => {
      if (helpers.isOfPrimitiveType(['string'], key)) {
        if (parent[key] === null) {
          return;
        }
        parent = parent[key];
      } else {
        throw "Argument keyPath contains a non string element!";
      }
    });

    let textClause = parent.$text;
    if (textClause) {
      delete textClause.$search;
    }

    return this;
  }

  // Date query operators
  static $date(value) {
    return {
      $date: value
    };
  }

  // Logical query operators

  $or(keyPath = [], clauses = []) {
    if (!Array.isArray(keyPath) || !Array.isArray(clauses)) {
      throw "Each of the arguments must be an array!";
    }

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
    if (!parent.$or) {
      parent.$or = [];
    }

    clauses.forEach(clause => {
      let clausePrimaryKeys = Object.keys(clause);
      let orClauseMatched = parent.$or.find(orClause => JSON.stringify(Object.keys(orClause)) === JSON.stringify(clausePrimaryKeys));
      if (orClauseMatched) {
        if (helpers.isOfPrimitiveType(['object'], clause[clausePrimaryKeys[0]])) {
          orClauseMatched[[clausePrimaryKeys[0]]] = Object.assign(orClauseMatched[clausePrimaryKeys[0]], clause[clausePrimaryKeys[0]]);
        } else {
          orClauseMatched = clause;
        }
        parent.$or = parent.$or.filter(orClause => JSON.stringify(Object.keys(orClause)) !== JSON.stringify(clausePrimaryKeys));
        parent.$or.push(orClauseMatched);
      } else {
        parent.$or.push(clause);
      }
    });
    return this;
  }

  $orClear(keyPath = []) {
    if (!Array.isArray(keyPath)) {
      throw "Argument keyPath must be an array!";
    }
    let parent = this.body.query;
    keyPath.forEach(key => {
      if (helpers.isOfPrimitiveType(['string'], key)) {
        if (parent[key] === null) {
          return;
        }
        parent = parent[key];
      } else {
        throw "Argument keyPath contains a non string element!";
      }
    });

    delete parent.$or;

    return this;
  }

  $orRemoveFrom(keyPath = [], clauseKey) {
    if (!Array.isArray(keyPath)) {
      throw "Argument keyPath must be an array!";
    }

    if (!helpers.isOfPrimitiveType(['string'], clauseKey)) {
      throw "Argument clauseKey must be string!";
    }

    let parent = this.body.query;
    keyPath.forEach(key => {
      if (helpers.isOfPrimitiveType(['string'], key)) {
        if (parent[key] === null) {
          return;
        }
        parent = parent[key];
      } else {
        throw "Argument keyPath contains a non string element!";
      }
    });

    if (parent.$or) {
      parent.$or = parent.$or.filter(orClause => !Object.keys(orClause).includes(clauseKey));
    }

    if (!parent.$or.length) {
      delete parent.$or;
    }
    return this;
  }

  // Projection

  projectionAdd(keys = [], include = 1) {
    if (include === 0 || include === 1) {
      if (Array.isArray(keys)) {
        keys.forEach(key => {
          if (helpers.isOfPrimitiveType(['string'], key)) {
            if (!this.body.projection) {
              this.body.projection = {};
            }

            this.body.projection[key] = include;
          } else {
            throw "Argument keys contains a non string element!";
          }
        });
        return this;
      } else {
        throw "Argument keyPath must be an array!";
      }
    } else {
      throw "Argument include must be 0 or 1!";
    }
  }

  projectionRemove(key) {
    let projectionKeys = Object.keys(this.body.projection);
    if (projectionKeys.includes(key)) {
      delete this.body.projection[key];

      if (!projectionKeys.length) {
        delete this.body.projection;
      }

      return this;
    } else {
      throw "The key does not exist!";
    }
  }
}

exports.MongoQuery = MongoQuery;
