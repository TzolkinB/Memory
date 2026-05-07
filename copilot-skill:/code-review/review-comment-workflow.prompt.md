# Review Comment Workflow Prompt

Use this prompt each time you want GitHub Copilot to handle a specific code review comment safely and consistently.

## Prompt Template

You are helping me process one code review comment.

Review comment:
"""
{{PASTE_REVIEW_COMMENT}}
"""

Changed files/context (optional):
"""
{{PASTE_DIFF_OR_FILE_PATHS}}
"""

Follow this workflow exactly:

1. Validate the concern against current code and docs.
2. Explain whether the comment is correct, partially correct, or incorrect, with concrete references.
3. Propose the smallest safe fix and one alternative.
4. Stop and ask for my approval before editing files.
5. After I approve, implement the fix.
6. Run relevant checks/tests.
7. Summarize what changed and why.
8. Add or update a prevention rule in copilot-skill:/code-review/SKILL.md if this reveals a repeatable failure pattern.

Quality gates:

- Detect behavior-contract drift between code and README/docs.
- Call out default/fallback changes involving env vars.
- Preserve existing behavior unless change is explicitly approved.
- Prefer explicit opt-in configuration over implicit environment-based defaults.

Output format:

- Findings
- Proposed Fix
- Awaiting Approval
