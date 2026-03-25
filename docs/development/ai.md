---
sidebar_position: 5
title: AI Development
description: Laravel AI SDK for building AI features into your app, and Boost with MCP for AI-assisted development.
---

# AI Development

Saucebase ships with two layers of AI support: the [Laravel AI SDK](https://laravel.com/docs/ai) (`laravel/ai`) for building AI-powered features into your product, and [Laravel Boost](https://laravel.com/docs/boost) for accelerating development with AI coding assistants like Claude Code and GitHub Copilot.

---

## Building AI features

The [`laravel/ai`](https://laravel.com/docs/ai) package is already included as a production dependency and configured in `config/ai.php`. You can start building AI features without any additional setup beyond adding your API keys.

### Configuration

Add your provider keys to `.env`:

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...
GROQ_API_KEY=...
COHERE_API_KEY=...
ELEVENLABS_API_KEY=...
```

The default providers per capability are set in `config/ai.php`. OpenAI is the default for text and audio; Gemini for images; Cohere for reranking.

### Capabilities

| Capability | Entry point |
|---|---|
| Text generation / agents | `Agent` interface + `Promptable` trait |
| Image generation | `Image::of($prompt)->generate()` |
| Audio synthesis (TTS) | `Audio::of($text)->generate()` |
| Transcription (STT) | `Transcription::fromPath($path)->generate()` |
| Embeddings | `Embeddings::for($texts)->generate()` |
| Reranking | `Reranking::of($docs)->rerank($query)` |
| Vector stores | `Stores::create($name)` |

### Agents

Agents are the primary building block for text generation and chat. Create one with:

```bash
php artisan make:agent SupportAgent
```

```php title="app/Ai/Agents/SupportAgent.php"
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Promptable;

class SupportAgent implements Agent
{
    use Promptable;

    public function instructions(): string
    {
        return 'You are a helpful customer support agent.';
    }
}

// Prompt it
$response = (new SupportAgent)->prompt('How do I reset my password?');
echo $response->text;

// Stream a response from a route
return (new SupportAgent)->stream('How do I reset my password?');

// Queue a prompt
(new SupportAgent)->queue('Analyze this log...')->then(fn ($r) => /* ... */);
```

Use `#[Provider('anthropic')]`, `#[Temperature(0.7)]`, and similar PHP attributes to configure per-agent settings without touching the global config.

:::note
`laravel/ai` is at v0 — it's actively developed and the API may change. The official [Laravel AI documentation](https://laravel.com/docs/ai) is the authoritative reference for all capabilities, including structured output, conversation memory, tools, middleware, and testing helpers.
:::

---

## AI-assisted development

[Laravel Boost](https://laravel.com/docs/boost) is a dev dependency that makes your project context available to AI coding assistants. It works out of the box — no configuration needed to start using it.

### What's pre-configured

| File / Directory | Purpose |
|---|---|
| `boost.json` | Declares which AI agents, skills, and packages the project uses |
| `CLAUDE.md` / `AGENTS.md` | Project context loaded automatically by Claude Code and Copilot |
| `.mcp.json` | MCP server configuration |
| `.claude/skills/` | Claude Code–specific skill profiles |
| `.ai/skills/` | Agent-agnostic skill profiles |

### MCP server

The Boost MCP server gives an AI assistant live access to your running application:

- Database schema exploration and query execution
- Route listing
- Log file reading
- Official package documentation search

The `.mcp.json` in the project root already registers three servers: `laravel-boost`, `playwright`, and `shadcn-vue`. If you open the project in Claude Code, these are available immediately.

You can start the Boost MCP server manually with:

```bash
php artisan boost:mcp
```

:::tip
Claude Code picks up `.mcp.json` automatically when you open the project. You don't need to configure anything — just start coding.
:::

### Skills

Skills are domain-specific knowledge profiles that an AI assistant loads when working in a particular area. The following skills are pre-configured in `boost.json`:

| Skill | When it's useful |
|---|---|
| `developing-with-ai-sdk` | Building features with [`laravel/ai`](https://laravel.com/docs/ai) |
| `inertia-vue-development` | Vue and Inertia frontend work |
| `tailwindcss-development` | Tailwind CSS styling |
| `socialite-development` | OAuth and social login |

In Claude Code, you can load a skill explicitly with `/skill-name` or let Boost activate it from context.

---

## Next steps

- [Laravel AI documentation](https://laravel.com/docs/ai) — full API reference: structured output, streaming, tools, conversation memory, embeddings, testing
- [Laravel Boost documentation](https://laravel.com/docs/boost) — full Boost and MCP reference
- [Commands](./commands) — all available `php artisan make:agent`, `make:tool`, and other AI-related commands
