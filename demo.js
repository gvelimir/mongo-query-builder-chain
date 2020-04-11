const mongoQBModule = require('./module');

var mongoQB = new mongoQBModule.MongoQuery();
console.log(mongoQB.body);

mongoQB = new mongoQBModule.MongoQuery({
  query: {
    retailerId: {$ne: "-1"},
    retailerPool: {$exists: true},
    trash: 0
  },
  sort: {
    "retailerPool.quality.pos": 1,
    "retailerPool.name": 1,
    promoCode: -1
  }
});

console.log(mongoQB.addToQuery(['retailerId'], mongoQB.$ne("-1"))
  .addToQuery(['retailerPool'], mongoQB.$exists())
  .addToQuery(['trash'], 0)
  .sort("affiliateModel", 1)
  .sort("retailerPool.quality.pos", 1)
  .sort("retailerPool.name", 1)
  .sort("promoCode", -1)
  .getValue()
);
