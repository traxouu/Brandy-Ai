import bcrypt from "bcryptjs";
import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse email invalide."),
  password: z.string().min(8, "Le mot de passe doit faire 8 caractères minimum."),
});

export const registerSchema = credentialsSchema.extend({
  name: z.string().trim().min(2, "Indiquez votre nom (2 caractères minimum)."),
});

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
