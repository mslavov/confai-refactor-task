# Refactoring Exercise: Centralizing Database Access with AI Assistance

This repository is intentionally **messy** when it comes to database access.
Some calls happen directly on the client, some on the server, and the Supabase
client is instantiated in several different locations.

Your goal is to **streamline** that situation by creating a **single, well-typed
access layer** that can be used from both the client and the server.

Rather than implementing the refactor immediately, you will follow a structured
workflow designed to simulate how an AI coding assistant can guide (and learn
from) you through a multi-step refactor.

---

## Workflow Overview

- **(AI) Analyze the codebase and create `docs/current-state.md`** that lists
  every Supabase interaction **and** describes the current data flow, pain
  points, and open questions.
- **(User + AI) Generate a _refactoring guide_** that converts the current state
  into a new, centralized architecture
- **(User + AI) Implement the guide**, with the AI proposing code edits and the
  user reviewing each change

Each step should occur in its **own, fresh chat session** so that the context is
focused and short-lived.

---

## Detailed Instructions

### 0. Prerequisites

- Node ≥18 with `pnpm` installed
- A Supabase project & `.env.local` configured (see below)
- An AI coding assistant (e.g. GitHub Copilot Chat, Cursor, etc.)

```dotenv
# .env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 1. Analyze & Document the Current State _(performed by the AI assistant)_

**Goal:** have the AI locate every Supabase interaction **and** write a
comprehensive description of how data currently flows between client, server,
and Supabase.

Example user prompt:

```text
Can you find all references of using the Supabase client for database access? For each occurrence, record the file path, line number, is it on the server or client side, and a brief description.
Write it in docs/current-state.md when finished so I can review.
```

Deliverable (from AI): `docs/current-state.md` committed to the repo.

### 2. Generate a Refactoring Guide

Start a **new chat** and paste the entire contents of `docs/current-state.md`.

Prompt example:

```text
create a refacting guide based on the current state: we should create a DB library, which provides two ways of accessing the DB from the client and from the server. We should move all direct access to the DB to be done from the client, like getting test cases, as oposite to going through an API route. We should keep only the generate test plan as an API route, as we make an additional request to OpenAI, but then once the test plan is returned we should save it from the server side and return it to the client. Create the guide in the docs folder do not perform any code changes
```

Review and tweak the AI's response until you are satisfied.

Commit the finalized guide to `docs/refactor-plan.md`.

### 3. Let the AI Implement the Plan

Start another **new chat** and load the refactoring guide you just created.

Prompt example:

```text
Here is the agreed-upon refactor plan (paste file). Please implement it step by step. After each code edit, pause so I can review the diff.
```

Proceed through the implementation, reviewing, running tests, and making
adjustments as necessary.

---

## Tips for Working with the AI Assistant

- Keep prompts **specific**.
- After large context switches (e.g. between steps), start a brand-new chat.
- If the assistant makes an incorrect change there are three options:
  - Revert and tweak the prompt
  - Perform the change yourself
  - Ask the assistant to perform the change
- Commit early & often so you can easily roll back.

---

## FAQ

**Why not just refactor it myself?** Because the objective of this exercise is
to practice guiding an AI through a non-trivial code change, mimicking
real-world pair programming.

**What if I already know the perfect architecture?** Great! Use your expertise
to evaluate and steer the assistant.

---

Happy refactoring! 🎉
