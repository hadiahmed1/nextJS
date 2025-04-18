import { z } from "zod";

const signUpSchema = z.object({
    username: z.string(),
    email: z.string().email("Invalid email"),
    password: z.string().min(3).max(20),
});

export default signUpSchema;