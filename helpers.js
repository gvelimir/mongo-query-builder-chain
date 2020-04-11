function isOfPrimitiveType(types, value) {
  if (Array.isArray(types)) {
    return !!types.find(type => typeof value === type);
  } else {
    throw "Expected array of types!";
  }
}

function isSortDirection(direction) {
  return direction === -1 || direction === 1
}

module.exports = {
  isOfPrimitiveType: isOfPrimitiveType,
  isSortDirection: isSortDirection
};
