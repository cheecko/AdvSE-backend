const functions = {}

functions.getBasePrice = (price, size, baseSize) => {
  return price / size * baseSize
}

functions.round2Decimal = (value) => {
  return parseFloat(parseFloat(value).toFixed(2))
}

module.exports = functions