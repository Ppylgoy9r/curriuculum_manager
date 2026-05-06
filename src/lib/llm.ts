// lib/llm.ts - Abstraction layer for multiple LLM providers

interface LLMProvider {
  name: string;
  generate(prompt: string): Promise<string>;
}

// Ollama Provider
class OllamaProvider implements LLMProvider {
  name = 'ollama';
  private url: string;
  private model: string;

  constructor(url: string, model: string) {
    this.url = url;
    this.model = model;
  }

  async generate(prompt: string): Promise<string> {
    const response = await fetch(`${this.url}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false,
        options: { temperature: 0.3 },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.response || '';
  }
}

// OpenAI Provider
class OpenAIProvider implements LLMProvider {
  name = 'openai';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a curriculum analysis AI. Respond with ONLY valid JSON, no markdown.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
}

// Anthropic Claude Provider
class AnthropicProvider implements LLMProvider {
  name = 'anthropic';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(prompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 4096,
        system: 'You are a curriculum analysis AI. Respond with ONLY valid JSON, no markdown.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
  }
}

// Factory function to get appropriate provider
export function getLLMProvider(): LLMProvider {
  const provider = (process.env.LLM_PROVIDER || 'ollama').toLowerCase();

  switch (provider) {
    case 'openai':
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not set in environment');
      }
      return new OpenAIProvider(
        process.env.OPENAI_API_KEY,
        process.env.LLM_MODEL || 'gpt-3.5-turbo'
      );

    case 'anthropic':
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY not set in environment');
      }
      return new AnthropicProvider(
        process.env.ANTHROPIC_API_KEY,
        process.env.LLM_MODEL || 'claude-3-sonnet-20240229'
      );

    case 'ollama':
    default:
      const url = process.env.OLLAMA_URL || 'http://localhost:11434';
      const model = process.env.OLLAMA_MODEL || 'qwen2.5:3b';
      return new OllamaProvider(url, model);
  }
}
