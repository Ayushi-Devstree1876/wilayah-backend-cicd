// Import Moment.js
import * as moment from "moment";

export enum UserRole {
  ADMIN = "admin",
  PROVINCE_ADMIN = "province_admin",
  HOSPITAL_ADMINISTRATOR = "hospital_administrator",
  CONSULTANT = "consultant",
  PRACTITIONER = "practitioner",
  USER = "user",
  PATIENT = "patient",
  DISTRICT_ADMIN = "district_admin",
  HEAD_OF_DEPARTMENT = "head_of_department",
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
}

export enum Verification_Status {
  PENDING = "pending",
  COMPLETED = "completed",
  REJECTED = "rejected",
}

export enum Action_Type {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  RETRIVED = "RETRIVED",
  PROXY_LOGIN = "PROXY LOGIN",
  OTHER = "OTHER",
}

export const salting_rounds = parseInt(process.env.SALTING_ROUNDS);

export const ERROR_EMAIL = {
  email: ["hardik.k@devstree.in", "bhargav.v@devstree.in"],
};

export function generateRandomToken(): string {
  return require("crypto").randomBytes(16).toString("hex");
}

// Function to check if a date and time is in the past
export function checkPastDates(dateTime: string) {
  return moment(dateTime).isBefore(moment());
}

export function generateRandomPassword(length) {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*";
  const allChars = uppercase + lowercase + numbers + specialChars;

  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  return password;
}
