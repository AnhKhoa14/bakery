import Category from "../models/Category.js";

export async function seedCategories() {
    const categories = ["Cake", "Bread", "Pastry", "Cookie", "Cupcake", "Cream Puff"];
    await Category.insertMany(categories.map(name => ({ name })));
    console.log("Categories seeded successfully.");
}