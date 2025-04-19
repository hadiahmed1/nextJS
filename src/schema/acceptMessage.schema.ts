import { z } from "zod";

const acceptMessageSchema = z.object({
    isAcceptingMessage: z.boolean()
});

export default acceptMessageSchema;