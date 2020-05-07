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

Create a clause with a key _clause_field_ with a value _clause_value_
```javascript
mongoQuery.clause('clause_field', 'clause_value')
```
It returns an object with one key and its value.

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
mongoQuery.$eq(value)
```
It returns the object containing only the $eq operator as key and its value provided by the argument.

Inclusion in the specified _array_
```javascript
mongoQuery.$in(array)
```
It returns the object containing only the **$in** operator as key and its value as array provided by the argument.

Similar usage is applied for the rest of the comparison operators.

#### Element operators

Partial support for the current mongodb query [element operators](https://docs.mongodb.com/manual/reference/operator/query-element/).

Existing of a specified field by _value_
```javascript
mongoQuery.$exists(value)
```
It returns the object containing only the **$exists** operator as key and its value provided by the argument. The default value is true.

#### Date operators

Partial support fo the current mongodb query date operators.

Adds a date match by a specified _value_
```javascript
mongoQuery.$date(value)
```
It returns the object containing only the **$date** operator as key and its value provided by the argument. the provided argument must be of string type.

#### Evaluation operators

Partial support for the current mongodb query [evaluation operators](https://docs.mongodb.com/manual/reference/operator/query-evaluation/).

Add a text search by a specified _value_
```javascript
mongoQuery.$search(value)
```
It returns the object containing only the **$text** operator and its value - the **$search** operator as key and its value provided by the argument. If the **$text** key does not exist in the query, it is added automatically.

Remove the current text search
```javascript
mongoQuery.$searchRemove()
```
If the **$search** key is the last remaining in the **$text** operator, the **$text** key will be removed automatically. It returns the current state of the _mongoQuery_ object.

Adds a text language by a specified _value_ (the default _value_ is "none")
```javascript
mongoQuery.$language(value)
```
It returns the object containing only the **$text** operator and its value with the **$language** operator as key and its value provided by the argument. If the **$text** key does not exist in the query, it is added automatically.

Remove the current text language
```javascript
mongoQuery.$languageRemove()
```
If the **$language** key is the last remaining in the **$text** operator, the **$text** key will be removed automatically. It returns the current state of the _mongoQuery_ object.

#### Logical operators

Partial support for the current mongodb query [logical operators](https://docs.mongodb.com/manual/reference/operator/query-logical/).

Add an **$or** operator on a location _keyPath_ as an array of fields, on _clause1_ and _clause2_
```javascript
mongoQuery.$or(keyPath, [clause1, clause2])
```
It returns the current state of the _mongoQuery_ object containing the **$or** operator under the keyPath.

Remove a clause from the **$or** operator under the location _keyPath_
```javascript
mongoQuery.$orRemoveFrom(keyPath, 'clause_field1')
```
If the clause with the key _'clause_field1'_ is the last remaining in the **$or** operator, the **$or** operator will be removed automatically from the query. It returns the current state of the _mongoQuery_ object.

Remove the **$or** operator under the location _keyPath_
```javascript
mongoQuery.$orClear(keyPath)
```
If not specified, the default value of the _keyPath_ is an empty array. It returns the current state of the _mongoQuery_ object.

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

## Projecting

Partial support for the current mongodb query [projection](https://docs.mongodb.com/manual/reference/glossary/#term-projection).

Add a projection criteria with keys _field1_, _field2_, _field3_ intended to be excluded
```javascript
mongoQuery.projectionAdd(['field1', 'field2', 'field3'], 0);
```
The second argument, denoting the inclusion of the fields, accepts only 0 and 1 as values. It returns the current state of the mongoQuery object.

Add a projection criteria with keys _field4_, _field5_ intended to be included
```javascript
mongoQuery.projectionAdd(['field4', 'field5']);
```
The default inclusion value is 1 and therefore the second argument is not necessary.

Remove a projection criteria with key _field4_
```javascript
mongoQuery.projectionRemove('field4');
```
It returns the current state of the mongoQuery object.

## Getting the query

Get the complete body of the query, ready for making a request to mongodb
```javascript
mongoQuery.getValue();
```
