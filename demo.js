const mongoQBModule = require('./module');
const util = require('util')

var mongoQB = new mongoQBModule.MongoQuery();
console.log(mongoQB.body);

mongoQB = new mongoQBModule.MongoQuery({
  query: {
    field1: {$ne: "-1"},
    field2: {$exists: true},
    field3: 0
  },
  sort: {
    "field1.field11.field111": 1,
    "field2.field21": 1,
    field4: -1
  }
});
console.log(mongoQB.body);

console.log(util.inspect(mongoQB.addToQuery(['field1'], mongoQBModule.MongoQuery.$ne("-1"))
  .addToQuery(['field2'], mongoQBModule.MongoQuery.$exists())
  .addToQuery(['field3'], 0)
  .addToQuery(['field4'], mongoQBModule.MongoQuery.$gte(mongoQBModule.MongoQuery.$date(1583794800000)))
  .addToQuery(['field4'], mongoQBModule.MongoQuery.$lte(mongoQBModule.MongoQuery.$date(1593727200000)), true)
  .addToQuery([], mongoQBModule.MongoQuery.$language(), true)
  .projectionAdd(['projection_field2', 'projection_field3', 'projection_field4'])
  .projectionAdd(['projection_field1', 'projection_field5'], 0)
  .projectionRemove('projection_field2')
  .$or([], [mongoQB.clause('clause_field1', 'clause_value1'), mongoQBModule.MongoQuery.$language(), mongoQBModule.MongoQuery.$search('search_value')])
  .$orRemoveFrom([], 'clause_field1')
  .$orClear()
  .sort("field0")
  .sort("field1.field11.field111")
  .sort("field2.field21")
  .sort("field4", -1)
  .getValue(), false, null, true));
