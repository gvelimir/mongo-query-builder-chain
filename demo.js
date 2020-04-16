const mongoQBModule = require('./module');

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

console.log(mongoQB.addToQuery(['field1'], mongoQB.$ne("-1"))
  .addToQuery(['field2'], mongoQB.$exists())
  .addToQuery(['field3'], 0)
  .sort("field0", 1)
  .sort("field1.field11.field111", 1)
  .sort("field2.field21", 1)
  .sort("field4", -1)
  .$searchRemove()
  .getValue()
);
