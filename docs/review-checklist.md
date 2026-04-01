# Code Review Checklist

Use this checklist for every PR review. Prioritize correctness and regression risk first.

## 1. Functional Correctness
- Does the change satisfy the stated requirement?
- Are success paths and failure paths both handled?
- Are edge cases handled (empty state, invalid input, timeout, missing data)?

## 2. Regression Risk
- Could this change break existing API behavior, routing, or data format?
- Any side effects on auth, permissions, upload flow, or task status flow?
- Are backward compatibility assumptions explicit?

## 3. Code Quality
- Is logic readable and split into sensible units?
- Are names clear and consistent with project style?
- Is there dead code, duplication, or hidden coupling?

## 4. Security and Reliability
- Any credential/token exposure risk?
- Is input validated and sanitized where needed?
- Are errors surfaced with actionable messages and safe defaults?

## 5. Test Coverage
- Are critical paths covered by tests (or manual evidence if tests not present yet)?
- Do tests validate both happy path and error path?
- Is there at least one verification for changed behavior?

## 6. Performance and Operations
- Any obvious performance regression risk?
- Does this affect startup/runtime config, container behavior, or deployment assumptions?
- Are logs and observability implications considered?

## 7. Documentation and Developer Experience
- Is README/usage updated when behavior changes?
- Are migration or setup steps documented?
- Can another developer reproduce and verify in under 10 minutes?
