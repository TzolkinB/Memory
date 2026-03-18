---
name: debugging-workflow
description: 'General debugging and problem-solving workflow. Use when: analyzing issues, implementing fixes, debugging problems, or when unsure about root cause'
---

# Debugging Workflow

## Core Principles

### 1. Always Analyze the Problem Context Before Implementing Fixes

**STOP AND THINK FIRST.** Before jumping into solutions:

- What exactly is broken?
- What was the expected behavior?
- When did this start happening?
- What are the symptoms vs. the root cause?

```bash
# Good practice: Gather information first
git log --oneline -10                    # Recent commits
git diff HEAD~1                          # What changed recently
git status                               # Current state
```

### 2. Check Recent Changes and Git History Before Assuming Root Cause

**UNDERSTAND THE CHANGE TIMELINE.** Often the fastest fix is reverting problematic changes rather than creating workarounds:

```bash
# Investigate recent changes
git log --oneline --since="1 week ago"   # Recent work
git show HEAD                            # Last commit details
git blame <file>                         # Who changed what line
git bisect                               # Find the breaking commit
```

**Ask yourself:**

- What was working before?
- What changed between working and broken states?
- Is this a new bug or a regression?
- Would reverting be simpler than fixing forward?

### 3. Ask Clarifying Questions Rather Than Making Assumptions

**CLARIFY BEFORE ACTING.** When uncertain:

- Ask the user for specifics about expected behavior
- Confirm your understanding of the problem
- Verify your proposed solution addresses the actual need
- Don't assume you know what the user wants

**Example clarifying questions:**

- "What should happen when...?"
- "Is this a new feature or fixing existing behavior?"
- "Should I revert this change or fix it differently?"
- "What was working before that isn't now?"

## Debugging Methodology

### Step 1: Problem Analysis

1. **Read error messages carefully** - Don't skip past them
2. **Reproduce the issue consistently** - Understand the exact steps
3. **Check logs and console output** - Look for warnings/errors
4. **Identify what changed** - Recent commits, deployments, config changes

### Step 2: Context Investigation

1. **Review git history** - `git log`, `git diff`, `git blame`
2. **Check related files** - Dependencies, configurations, tests
3. **Understand the system state** - Environment, versions, settings
4. **Look for patterns** - Is this isolated or systemic?

### Step 3: Solution Strategy

1. **Consider revert vs. fix-forward** - Sometimes simpler to undo
2. **Start with minimal changes** - Don't over-engineer solutions
3. **Test your hypothesis** - Verify the fix solves the actual problem
4. **Consider side effects** - Will this break anything else?

## Case Study: UI Layout Debugging

### Problem

Cards in a memory game aren't displaying - UI shows header and controls but card grid area is empty.

### ❌ Anti-Pattern Approach

```
1. See empty card area
2. Immediately start modifying CSS
3. Add complex workarounds for layout issues
4. Layer on more CSS fixes when first attempt doesn't work
5. End up with overcomplicated solution
```

### ✅ Correct Approach

```
1. ANALYZE: Cards exist in DOM but not visible - CSS layout issue
2. CHECK HISTORY: What changed recently? Added test div wrapper
3. ASK: "We added data-testid='card-grid' for testing but forgot to check UI.
   Can't we just add data-testid to existing div instead of creating new one?"
4. SOLUTION: Remove extra div wrapper, add testid to original element
5. RESULT: Simple fix, reverts to known working state
```

### Key Lesson

The extra `<div data-testid="card-grid">` wrapper was added for testing but broke the original CSS layout. Instead of creating complex CSS workarounds, the solution was simply removing the unnecessary wrapper and adding the `data-testid` to the existing `.card-deck` div.

**Root cause**: Extra HTML nesting broke CSS selectors  
**Simple fix**: Remove extra wrapper  
**Avoided**: Complex CSS grid/flexbox workarounds

## Anti-Patterns to Avoid

1. **Fix-first mentality** - Implementing solutions before understanding the problem
2. **Assumption-driven debugging** - Guessing root cause without investigation
3. **Workaround complexity** - Adding layers of fixes instead of addressing root cause
4. **Ignoring version control** - Not checking what changed recently
5. **Silent assumptions** - Not clarifying requirements with the user
6. **Over-engineering** - Creating complex solutions for simple problems

## Key Principles

- **Think before coding** - Analysis first, implementation second
- **History is your friend** - Git tells the story of what changed
- **Simple is better** - Prefer reverting/removing over complex workarounds
- **Ask when unsure** - Clarifying questions prevent wrong solutions
- **Start minimal** - Small targeted changes over large refactoring
- **Test your understanding** - Verify the problem before proposing solutions
