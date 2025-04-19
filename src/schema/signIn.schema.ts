import { z } from "zod";

const signInSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().max(20),
});

export default signInSchema;