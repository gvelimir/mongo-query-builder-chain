# mongo-query-builder-chain

JS library for generating mongodb queries as chain easily.

# usage

var mongoQBChain = require("mongo-query-builder-chain"); **_// load the library into a file_**

var mongoQuery = new mongoQBChain.MongoQuery(); **_// initialize an empty mongodb query_**

var mongoQuery = new mongoQBChain.MongoQuery({query: {field1: {$ne: "-1"}, field2: {$exists: true}, field3: 0}, sort: {"field1.field11.field111": 1, "field2.field21": 1, field4: -1}}); **_// initialize a mongodb query_**

mongoQuery.addToQuery(['field1', 'field11'], mongoQB.$ne("-1")) **_// adds field11 under field1 with {$ne: "-1"} value_**

mongoQuery.removeFromQuery(['field1']) **_// removes field1 along with its child field1 from the query_**

mongoQuery.sort("field1.field11", 1) **_// applies sort by asc on the child field11_**

mongoQuery.removeFromQuery(['field1']) **_// removes field1 along with its child field1 from the query_**

mongoQuery..getValue() **_// retrieves the whole body of the query_**
