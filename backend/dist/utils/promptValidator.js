import { openai } from "../config/openAI";
import { SYSTEM_PROMPTS } from "./devGptPrompt";
export const validateDevPrompt = async (prompt, type) => {
    const systemPrompt = type === 'image'
        ? SYSTEM_PROMPTS.IMAGE_GENERATION
        : SYSTEM_PROMPTS.TEXT_CHAT;
    try {
        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: type === 'image'
                        ? `Validate this image generation prompt: "${prompt}"`
                        : prompt
                }
            ],
        });
        const response = choices[0].message.content || '';
        if (type === 'image') {
            if (response.includes('REJECTED:')) {
                return {
                    valid: false,
                    message: response.replace('REJECTED:', '').trim()
                };
            }
            else if (response.includes('APPROVED:')) {
                const enhancedPrompt = response.replace('APPROVED:', '').trim();
                return { valid: true, enhancedPrompt };
            }
        }
        return { valid: true, message: response };
    }
    catch (error) {
        throw error;
    }
};
