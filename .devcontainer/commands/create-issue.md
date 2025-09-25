---
description: Interactive GitHub issue creation workflow that guides you through drafting comprehensive, well-structured issues with clear requirements and acceptance criteria
---

# /create-issue Command Prompt

## Purpose

Interactive command for creating detailed GitHub issues through a collaborative process that ensures clarity and completeness before submission.

## Usage

- `/create-issue` - Start interactive issue creation process
- `/create-issue [type]` - Start with specific issue type (e.g., "feature", "bug", "enhancement")
- `/create-issue [branch-name]` - Pre-fill branch name for the issue file

$ARGUMENTS

## Process

### 1. Initial Discussion

- Understand the feature request or bug report
- Ask clarifying questions about requirements and constraints
- Identify key stakeholders and success criteria

### 2. Draft Creation

- Create a `new_issues/` directory if it doesn't exist
- Name the file based on the feature/branch name (e.g., `new_issues/token-recycling-arcade.md`)
- If arguments provided, use them to pre-fill issue type or filename
- Use the following structure:
  - **Overview**: One paragraph summary of what needs to be done
  - **Background**: Context and motivation for why this is needed
  - **Requirements**: Clear, specific requirements focused on behavior
  - **Acceptance Criteria**: Measurable criteria for completion
  - **Technical Context**: Helpful pointers to relevant code and patterns
  - **Testing Requirements**: What tests are needed
  - **Future Considerations**: How this fits into the broader roadmap

### 3. Key Principles

- **Focus on WHAT, not HOW**: Describe requirements and behavior, not implementation
- **Empower the implementer**: Provide context but let them make technical decisions
- **Be complete but concise**: Include all necessary information without over-specifying
- **Consider the reader**: A developer should be able to start work without asking questions

### 4. Review Process

- Review the draft from the perspective of an assigned developer
- Check for missing context or ambiguous requirements
- Add technical context (file locations, existing patterns) without prescribing solutions
- Iterate based on user feedback

### 5. Final Steps

- Only create the GitHub issue after user approval
- Use descriptive title and appropriate labels
- Reference any related issues or discussions

## What Makes a Good Issue

### DO Include:

- Clear problem statement or feature description
- Specific acceptance criteria
- Technical constraints and context
- References to relevant code locations
- Testing requirements
- Questions that need answers during implementation

### DON'T Include:

- Detailed implementation code
- Specific data structure choices
- Algorithm implementations
- Prescriptive technical solutions
- Assumptions about the "best" approach

## Example Structure

You can reference an issue template if one exists:
@.github/ISSUE_TEMPLATE/feature_request.md

Or use this structure:

```markdown
# [Feature/Bug]: Brief descriptive title

## Overview

One paragraph explaining what needs to be done and why.

## Background

Context about the current situation and why this change is needed.

## Requirements

- Specific functional requirements
- Performance requirements
- Security requirements
- Compatibility requirements

## Technical Context

- Relevant files: `path/to/file.cairo`
- Related interfaces: `IRelevantInterface`
- Existing patterns: Brief description
- Dependencies: What this relies on

## Acceptance Criteria

- [ ] Specific measurable outcome 1
- [ ] Specific measurable outcome 2
- [ ] Tests pass
- [ ] Documentation updated

## Testing Requirements

Types of tests needed without specifying implementation.

## Questions for Implementation

Open questions that the implementer should consider.
```

## Benefits of This Approach

1. **Collaborative**: Ensures all perspectives are considered
2. **Complete**: Reduces back-and-forth during implementation
3. **Flexible**: Allows implementers to use their expertise
4. **Efficient**: Front-loads thinking to save time later
5. **Educational**: Helps users write better issues over time
