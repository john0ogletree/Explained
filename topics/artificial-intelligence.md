---
tags: [ai, machine learning, technology]
---

# Artificial Intelligence

**Artificial intelligence (AI)** is the field of building systems that perform tasks we associate with human intelligence — reasoning, learning, perceiving, understanding language, and making decisions. The term was coined in 1956 at the Dartmouth Workshop, but the ideas stretch back further, and the modern boom is only about a decade old.

The field splits into a few overlapping eras, each defined by what was actually possible at the time.

## A Short History

- **1950s–1960s — Symbolic AI.** Programs manipulated logical rules and symbols. Good at math proofs, terrible at anything fuzzy.
- **1970s–1980s — Expert Systems.** Hand-coded rules from human experts. Worked in narrow domains, collapsed under maintenance.
- **1990s–2000s — Statistical AI.** Machine learning replaced hand-coded rules. Systems learned patterns from data instead.
- **2010s — Deep Learning.** Neural networks with many layers, trained on GPUs, beat humans at image recognition and speech.
- **2020s — Foundation Models.** Massive pretrained models (GPT, Claude, Gemini, Llama) that generalize across tasks with minimal fine-tuning.

> Each wave followed the same pattern: hype, funding, disappointment, then quiet progress that made the next wave possible.

## How Modern AI Actually Works

Almost all the AI you interact with today is a **neural network** trained with **gradient descent** on large datasets. The core loop:

1. Feed the model an input (text, image, audio).
2. The model produces an output (a prediction, a token, a label).
3. Compare the output to the correct answer — that's the **loss**.
4. Nudge every weight in the network slightly to reduce the loss.
5. Repeat billions of times.

That's it. The magic isn't the algorithm — it's the scale.

## Types of AI People Talk About

| Type | What it means | Exists today? |
|---|---|---|
| Narrow AI | Good at one task | Yes — everywhere |
| General AI (AGI) | Matches humans across domains | No |
| Superintelligence | Far exceeds humans | No |

The confusion between these three drives most bad AI arguments. A chatbot acing the bar exam is narrow AI that happens to be very good at one thing.

## Large Language Models

**LLMs** are neural networks trained to predict the next token in a sequence. That single objective, scaled up, produces models that can:

- Answer questions
- Write and debug code
- Summarize long documents
- Translate between languages
- Reason through multi-step problems (imperfectly)

The catch: they don't *know* anything. They predict. When a prediction is wrong but plausible, that's a **hallucination**.

### A Tiny Example

Here's what a next-token prediction looks like in code:

```python
prompt = "The capital of France is"
# Model outputs a probability distribution over all tokens
probs = model.predict(prompt)
# Top candidate: " Paris" with probability ~0.97
next_token = sample(probs)
```

Scale that up to trillions of tokens of training data, and you get a chatbot.

## What AI Is Good At

- **Pattern recognition** at superhuman scale (medical imaging, fraud detection)
- **Generation** of plausible text, images, audio, code
- **Summarization** of long or dense material
- **Translation** between natural and programming languages
- **Search and retrieval** over unstructured data

## What AI Is Bad At

- **Knowing when it's wrong.** Confidence isn't calibrated.
- **Long-horizon planning.** Multi-step tasks drift.
- **Common sense.** It has none, only statistical priors.
- **Causality.** It learns correlation, not cause.
- **Novel situations.** Distribution shift breaks it silently.

> The most dangerous AI failure isn't a robot uprising. It's a confident wrong answer delivered in a tone that sounds certain.

## The Real Risks

People argue about two very different categories of risk.

### Near-term risks

- **Misinformation** at scale — generated text, images, video that look real
- **Job displacement** in cognitive tasks, not just manual ones
- **Bias amplification** — models learn and reproduce human prejudice
- **Concentration of power** — a few labs control the best models
- **Security** — prompt injection, data exfiltration, model theft

### Long-term risks

- **Alignment** — making a powerful system actually do what we want
- **Deceptive behavior** — models that act safe when watched, differently otherwise
- **Runaway capability** — systems improving themselves faster than we can steer
- **Governance failure** — no one able to enforce limits internationally

Both categories are real. The debate is about which deserves more attention right now.

## How It's Being Used

Some of the least-hyped, most-impactful uses:

- **Drug discovery** — protein folding, molecule screening
- **Weather forecasting** — faster and more accurate than physics sims
- **Code assistance** — autocomplete, review, test generation
- **Customer support** — deflection and triage
- **Scientific literature** — summarization and cross-referencing
- **Accessibility** — real-time transcription, image description, translation

## What To Actually Learn

If you want to work with AI rather than just use it:

1. **Linear algebra and probability** — the actual math
2. **Python** — plus PyTorch or JAX
3. **How transformers work** — read "Attention Is All You Need"
4. **Fine-tuning and prompting** — practical, high-leverage
5. **Evaluation** — how to know if a model is actually good
6. **Systems thinking** — AI is one component, not the product

## The Honest Summary

AI today is:

- Genuinely transformative in narrow domains
- Overhyped as a general intelligence
- Underhyped as an infrastructure shift
- Not magic, not useless, and not neutral

It's a tool. A very powerful, very general, very fast-moving tool. What it does depends on who builds it, what they optimize for, and who's allowed to use it.

> The interesting question isn't "can AI do X?" It's "who benefits when AI does X, and who doesn't?"

## Further Reading

- [Attention Is All You Need (2017)](https://arxiv.org/abs/1706.03762)
- [Deep Learning (Goodfellow, Bengio, Courville)](https://www.deeplearningbook.org/)
- [Anthropic — Core Views on AI Safety](https://www.anthropic.com/news/core-views-on-ai-safety)
- [AI Index Report (Stanford HAI)](https://aiindex.stanford.edu/report/)
