import PaymentMethod from "../models/PaymentMethod.js";

export async function seedPaymentMethods() {
  const paymentMethods = [
    { name: "Credit Card", isEnabled: true },
    { name: "PayPal", isEnabled: true },
    { name: "Bank Transfer", isEnabled: false },
  ];

  for (const method of paymentMethods) {
    await PaymentMethod.updateOne(
      { name: method.name },
      { $setOnInsert: method },
      { upsert: true }
    );
  }

  console.log("Payment methods seeded successfully.");
}
