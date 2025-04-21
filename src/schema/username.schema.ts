import { z } from "zod";

export const usernameValidation = z.string().min(2, "user name too short").max(20, "username too long");