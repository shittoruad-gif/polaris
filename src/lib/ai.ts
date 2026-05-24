import Anthropic from '@anthropic-ai/sdk';

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export async function generate(opts: {
  system: string;
  user: string;
  fallback: string;
  model?: string;
  maxTokens?: number;
}): Promise<{ text: string; fromAi: boolean }> {
  if (!client) return { text: opts.fallback, fromAi: false };
  try {
    const r = await client.messages.create({
      model: opts.model || process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
      max_tokens: opts.maxTokens ?? 1200,
      system: opts.system,
      messages: [{ role: 'user', content: opts.user }],
    });
    const block = r.content[0];
    const text = block && block.type === 'text' ? block.text : opts.fallback;
    return { text, fromAi: true };
  } catch (e) {
    console.error('[ai] error', e);
    return { text: opts.fallback, fromAi: false };
  }
}
