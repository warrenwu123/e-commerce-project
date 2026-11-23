const Product = require("../model/Product");

class CheckoutError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Atomically take stock for every item. If any item is short, return what was
// already taken and throw.
async function reserveStock(items) {
  const reserved = [];
  for (const item of items) {
    const result = await Product.updateOne(
      { _id: item.productId, totalStock: { $gte: item.quantity } },
      { $inc: { totalStock: -item.quantity } }
    );
    if (result.modifiedCount !== 1) {
      await releaseStock(reserved);
      throw new CheckoutError(400, `Insufficient stock for ${item.title}`);
    }
    reserved.push(item);
  }
  return reserved;
}

async function releaseStock(items) {
  for (const item of items) {
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { totalStock: item.quantity } }
    );
  }
}

const toCents = (amount) => Math.round(Number(amount) * 100);

module.exports = { CheckoutError, reserveStock, releaseStock, toCents };
