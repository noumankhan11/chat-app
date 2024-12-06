import * as z from "zod";

export const signupSchema = z.object({
  fullname: z.string().max(20).min(3),
  username: z
    .string()
    .max(20)
    .min(3)
    .regex(/^\S+$/, "Username cannot contain spaces"),
  gender: z.enum(["male", "female"]).optional(),
  password: z
    .string()
    .max(20)
    .min(6, "Password must be atlest 6 characters long!"),
  confirmPassword: z
    .string()
    .max(20)
    .min(6, "Password must be atlest 6 characters long!"),
  profilePic: z
    .instanceof(File)
    .refine(
      (file) => {
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        return validTypes.includes(file.type);
      },
      { message: "Only JPEG, PNG, and GIF files are allowed" }
    )
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "File size must be less than or equal to 2MB",
    })
    .optional(),
});

// login Schema
export const loginSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .max(20)
    .min(3, "Username must be atleast three characters long!")
    .regex(/^\S+$/, "Username cannot contain spaces"),

  password: z
    .string()
    .max(20)
    .min(6, "Password must be atleast six characters long!"),
});
