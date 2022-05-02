# Minimizing turnaround time on code reviews

The best thing you can do to keep code reviews quick is to keep your PRs easy to review.

- Keep the PR functionally focussed - change only a few things not many
- Keep the code easy to understand for reviewer
- Add context / screenshots / screencapture in PR description

Turns out, all of these considerations also make for an easy to maintain codebase!

## Code review roles

There are three roles in a code review:

- *Author*: The person submitting the PR.
- *Reviewer*: Anybody who can approve the PR. We auto-populate this list using GitHub's [CODEOWNERS facility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners).
- *Assignee*: Manually added reviewers who are responsible for the review.

We use the assignee role to track which reviewers are responsible for (speedy) code reviews.

As an author, you should

- Add two [assignees](https://docs.github.com/en/issues/tracking-your-work-with-issues/assigning-issues-and-pull-requests-to-other-github-users) for your PRs.
  - To clearly signal the responsible reviewers, it is best to assign exactly two reviewers (for the two required approvals).
- Assign new folks if the number of assignees falls below two and you still need two approvals.
- Feel empowered to ping assignees if you do not have reviews in a reasonable amount of time.
  It is their responsibility to give you timely reviews (see point below about assignee load-shedding).

As an assignee, you should:

- Review assigned PRs timely. It is safe to say that reviewing assigned PRs should be prioritized over writing new PRs.
- Load-shed if you have too many reviews assigned to you. Tell the PR author you don't have bandwidth / context / confidence for reviewing the PR and unassign yourself.

Finally, the assignee role is intended to only formalize responsibility. Any of the of the other reviewers can also review and approve a PR.