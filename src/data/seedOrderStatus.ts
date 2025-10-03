import OrderStatus from "../models/OrderStatus.js";

export async function seedOrderStatuses() {
    const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    await OrderStatus.insertMany(statuses.map(name => ({ name })));
    console.log("Order statuses seeded successfully.");
}