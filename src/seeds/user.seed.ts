// src/seeds/user.seed.ts
export const UserSeed = {
  first_name: "Admin",
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  role: {},
};
