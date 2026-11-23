// Seed the database: ensures an admin account exists and, if the products
// collection is empty, inserts a few sample products and a banner.
//
//   npm run seed
//
// Safe to run more than once: it never overwrites an existing admin's
// password and never adds products to a non-empty catalogue.

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../model/user");
const Product = require("../model/Product");
const Feature = require("../model/Feature");

const img = (text) =>
  `https://placehold.co/600x600/png?text=${encodeURIComponent(text)}`;

const sampleProducts = [
  { title: "Classic Oxford Shirt", category: "men", types: "shirts", size: "m", colour: "white", price: 45, salePrice: 39, totalStock: 50 },
  { title: "Slim Fit Chinos", category: "men", types: "pants", size: "l", colour: "black", price: 55, salePrice: 0, totalStock: 40 },
  { title: "Floral Summer Dress", category: "women", types: "dresses", size: "s", colour: "red", price: 70, salePrice: 59, totalStock: 30 },
  { title: "Wool Blend Coat", category: "women", types: "coats", size: "m", colour: "grey", price: 160, salePrice: 0, totalStock: 15 },
  { title: "Kids Hooded Jacket", category: "kids", types: "outerwear", size: "s", colour: "blue", price: 40, salePrice: 32, totalStock: 25 },
  { title: "Leather Belt", category: "accessories", types: "belts", size: "m", colour: "black", price: 25, salePrice: 0, totalStock: 60 },
  { title: "Canvas Sneakers", category: "footwear", types: "sneakers", size: "l", colour: "white", price: 65, salePrice: 49, totalStock: 35 },
].map((p) => ({
  ...p,
  image: img(p.title),
  description: `${p.title}: sample product created by the seed script.`,
  averageReview: 0,
}));

async function seedAdmin() {
  const { SEED_ADMIN_USERNAME = "admin", SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } =
    process.env;

  if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
    console.log("Skipping admin: set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env");
    return;
  }

  const existing = await User.findOne({ email: SEED_ADMIN_EMAIL });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log(`Promoted ${SEED_ADMIN_EMAIL} to admin`);
    } else {
      console.log(`Admin ${SEED_ADMIN_EMAIL} already exists`);
    }
    return;
  }

  await User.create({
    userName: SEED_ADMIN_USERNAME,
    email: SEED_ADMIN_EMAIL,
    password: await bcrypt.hash(SEED_ADMIN_PASSWORD, 12),
    role: "admin",
  });
  console.log(`Created admin ${SEED_ADMIN_EMAIL}`);
}

async function seedCatalogue() {
  if ((await Product.countDocuments()) > 0) {
    console.log("Products already present, skipping sample products");
  } else {
    await Product.insertMany(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} sample products`);
  }

  if ((await Feature.countDocuments()) === 0) {
    await Feature.create({
      image: "https://placehold.co/1600x500/png?text=New+Season+Collection",
    });
    console.log("Inserted a sample banner");
  }
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set in server/.env");
  }
  await mongoose.connect(process.env.MONGO_URI);
  // Build the unique indexes on User before inserting
  await User.syncIndexes();
  await seedAdmin();
  await seedCatalogue();
}

main()
  .then(() => console.log("Seed complete"))
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
