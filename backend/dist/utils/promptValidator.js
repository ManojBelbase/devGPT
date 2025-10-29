"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDevPrompt = void 0;
const openAI_1 = require("../config/openAI");
const devGptPrompt_1 = require("./devGptPrompt");
const validateDevPrompt = async (prompt, type) => {
    const systemPrompt = type === 'image'
        ? devGptPrompt_1.SYSTEM_PROMPTS.IMAGE_GENERATION
        : devGptPrompt_1.SYSTEM_PROMPTS.TEXT_CHAT;
    try {
        const { choices } = await openAI_1.openai.chat.completions.create({
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
exports.validateDevPrompt = validateDevPrompt;
