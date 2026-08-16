# V2.1 Learning UI Standard

## Goal

Reduce cognitive load without reducing instructional depth. Course pages should feel like a guided learning journey rather than a long article.

## Core principles

1. One screen, one learning intention.
2. Use visual hierarchy before adding more prose.
3. Convert repeated metadata into compact cards, chips, icons, and progress indicators.
4. Keep explanatory text readable with generous line-height and bounded line length.
5. Separate `learn`, `discover`, `think`, `practice`, and `check` visually.
6. Primary actions must be obvious and limited in number.
7. Mobile/iPad layout must remain comfortable for touch.
8. Visual decoration must never compete with chemical notation or experimental evidence.

## Lesson information architecture

```text
Hero
  ↓
Learning flow
  ↓
Action cards
  ↓
Knowledge cards
  ↓
Learning modules / timeline
  ↓
Practice / experiment / diagnosis
```

## Visual language

- Blue: learning / knowledge
- Violet: conceptual thinking
- Teal/green: experiment / evidence / success
- Amber: caution / attention
- Pink: misconception / correction
- Neutral cards: explanatory text

Color is always paired with labels/icons; color alone must not encode meaning.

## Density rules

- Avoid long uninterrupted paragraphs.
- Prefer short paragraphs inside cards.
- Use headings and micro-labels to signal the learner's current task.
- Keep primary action cards above the first long content block.
- Do not turn every sentence into a card; grouping is required to prevent visual fragmentation.

## Accessibility

- Maintain readable contrast.
- Do not rely on color alone.
- Buttons require clear labels and touch-friendly targets.
- Decorative icons use empty alt text / aria-hidden.
- Chemical formulas and equations remain selectable text.

## Content/UI boundary

The UI may restructure presentation but must not rewrite scientific meaning. Content remains the source of truth; the renderer is responsible for hierarchy, spacing, grouping, and interaction.

## Acceptance criteria

A lesson UI is accepted when a Grade-9 learner can answer, at a glance:

- What am I learning?
- What should I do next?
- What do I need to remember?
- Where is the experiment?
- Where do I practice?
- Where do I check whether I really understood?

without reading the entire page first.
