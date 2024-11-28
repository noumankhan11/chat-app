import * as z from "zod";

export const signupSchema = z.object({
  fullname: z.string().max(20).min(3),
  username: z
    .string()
    .max(20)
    .min(3)
    .regex(/^\S+$/, "Username cannot contain spaces"),
  gender: z.enum(["male", "female"]),
  password: z
    .string()
    .max(20)
    .min(6, "Password must be atlest 6 characters long!"),
  confirmPassword: z
    .string()
    .max(20)
    .min(6, "Password must be atlest 6 characters long!"),
});
export const loginSchema = z.object({
  username: z
    .string()
    .max(20)
    .min(3, "Username must be atleast three characters long!")
    .regex(/^\S+$/, "Username cannot contain spaces"),

  password: z
    .string()
    .max(20)
    .min(6, "Password must be atleast six characters long!"),
});
