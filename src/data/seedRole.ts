import Role from "../models/Role.js";

export async function seedRoles() {
  const roles = ["ADMIN", "CUSTOMER", "MANAGER"];
  for (const name of roles) {
    const existing = await Role.findOne({ name });
    if (!existing) {
      await Role.create({ name });
      console.log(`Role '${name}' created.`);
    } else {
      console.log(`Role '${name}' already exists.`);
    }
  }
}
