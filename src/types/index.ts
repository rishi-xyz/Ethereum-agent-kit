/**
 * Chat message type
 * @property id - The id of the message
 * @property role - The role of the message
 * @property content - The content of the message
 * @property timestamp - The timestamp of the message
 */

export type ChatMessage = {
    id?: string;
    role: "user" | "model";
    content: string;
    timestamp?: Date;
};