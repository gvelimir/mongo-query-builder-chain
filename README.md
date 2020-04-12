# mongo-query-builder-chain

JS library for easily generating mongodb queries by method chaining.

## Usage

Load the library in a file
```javascript
var mongoQBChain = require("mongo-query-builder-chain");
```
Initialize an empty mongodb query
```javascript
var mongoQuery = new mongoQBChain.MongoQuery();
```
Initialize a mongodb query with predefined body
```javascript
var mongoQuery = new mongoQBChain.MongoQuery({
  query: {
    field1: "value_or_operator1",
    field2: "value_or_operator2",
    field3: "value_or_operator3"
  },
  sort: {
    "field1.field11.field111": sort_direction1,
    "field2.field21": sort_direction2,
    field3: sort_direction3
  }
});
```

## Query methods

Add a key _field11_ under _field1_ with a value to an existing query
```javascript
mongoQuery.addToQuery(['field1', 'field11'], value);
```
If the key already exists, only its value will be changed. The value can be primitive, object with containing the reserved supported operators. The location of the key inside the query is determined by the provided array with the value at the beginning denoting the root location and the value at the end denoting the exact name of the key. If any portion of the path does not exist in the current body of the query, it is automatically created. It returns the current state of the _mongoQuery_ object.

Remove the key _field1_ with its associated value if any
```javascript
mongoQuery.removeFromQuery(['field1']);
```
The location of the key inside the query is determined by the provided array with the value at the beginning denoting the root location and the value at the end denoting the exact name of the key. By removing the specified key, any kind of value (primitive or object) associated with it, will be removed.  It returns the current state of the _mongoQuery_ object.

### Query operators

Partial support for current mongodb query [operators](https://docs.mongodb.com/manual/reference/operator/query/).

#### Comparison operators

Full support for the current mongodb query [comparison operators](https://docs.mongodb.com/manual/reference/operator/query-comparison/).

Equal to a specified _value_
```javascript
mongoQB.$eq(value)
```
It returns the object containing only the $eq operator as key and its value provided by the argument.

Inclusion in the specified _array_
```javascript
mongoQB.$in(array)
```
It returns the object containing only the **$in** operator as key and its value as array provided by the argument.

Similar usage is applied for the rest of the comparison operators.

#### Element operators

Partial support for the current mongodb query [element operators](https://docs.mongodb.com/manual/reference/operator/query-element/).

Existing of a specified field by _value_
```javascript
mongoQB.$exists(value)
```
It returns the object containing only the **$exists** operator as key and its value provided by the argument. The default value is true.

#### Evaluation operators

Partial support for the current mongodb query [evaluation operators](https://docs.mongodb.com/manual/reference/operator/query-evaluation/).

Adds a text search by a specified _value_
```javascript
mongoQB.$search(value)
```
It returns the object containing only the **$text** operator and its value - the **$search** operator as key and its value provided by the argument. If the **$text** key does not exist in the query, it is added automatically.

Removes the current text search
```javascript
mongoQB.$searchRemove()
```
If the **$search** key is the last remaining in the **$text** operator, the **$text** key will be removed automatically. It returns the current state of the _mongoQuery_ object.

#### Date operators

Partial support fo the current mongodb query date operators.

Adds a date match by a specified _value_
```javascript
mongoQB.$date(value)
```
It returns the object containing only the **$date** operator as key and its value provided by the argument. the provided argument must be of string type.

## Sorting

Add a sort criteria with key _field1.field11_ that will alter the current sorting by ascending
```javascript
mongoQuery.sort("field1.field11", 1);
```
Any previous sorting is maintained and the sort key is added at the end of the sort part of the body. It returns the current state of the _mongoQuery_ object. It returns the current state of the mongoQuery object. 

Clear existing sort criteria
```javascript
mongoQuery.sortClear();
```
It returns the current state of the mongoQuery object.

## Getting the query

Get the complete body of the query, ready for making a request to mongodb
```javascript
mongoQuery.getValue();
```
