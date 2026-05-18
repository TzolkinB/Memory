# Agent Guidance

## Available agents

Use these agents for the full test lifecycle:

- `.github/agents/playwright-test-planner.agent.md` — explore the live app and write a structured test plan to `specs/`
- `.github/agents/playwright-test-generator.agent.md` — read a plan from `specs/` and generate a Playwright spec file in `tests/`
- `.github/agents/playwright-test-healer.agent.md` — debug and fix failing tests; marks unfixable tests as `test.fixme()` with an explanation

The intended workflow is: **planner → generator → healer**.

## When a test fails

When Playwright tests fail, use the playwright-testing skill at copilot-skill:/playwright-testing/SKILL.md and follow its "When a Test Fails" workflow.

## Scratch cleanup

After debugging or browser automation, remove temporary scratch artifacts that are not needed for source control (for example files under `.playwright-mcp/`).
