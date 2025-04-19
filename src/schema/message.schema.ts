import { z } from "zod";

const messageSchema = z.object({
    content: z.string().min(3, "message too short").max(300, "content too long(>300)")
})

export default messageSchema;