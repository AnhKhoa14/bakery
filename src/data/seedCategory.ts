import Category from "../models/Category.js";

export async function seedCategories() {
  const categories = ["Cake", "Bread", "Pastry", "Cookie", "Cupcake", "Cream Puff"];

  for (const name of categories) {
    await Category.updateOne(
      { name }, 
      { $setOnInsert: { productCount: 0, isDeleted: false } }, 
      { upsert: true }
    );
  }

  console.log("Categories seeded successfully.");
}
