import { z } from "zod";

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export const loginInputSchema = z.object({
  email: z.string().trim().email("Introduce un correo valido."),
  password: z.string().min(1, "Introduce la contrasena.")
});

export const registerInputSchema = z.object({
  name: z.string().trim().min(2, "El nombre es demasiado corto."),
  email: z.string().trim().email("Introduce un correo valido."),
  password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres."),
  company: z.string().trim().min(2, "La empresa es obligatoria.").optional()
});
