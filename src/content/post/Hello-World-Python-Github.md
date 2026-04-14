---
title: "Python App Setup with GitHub Pipelines"
description: "A guide to setting up a Python project on GitHub with security-focused CI/CD workflows."
publishDate: "2022-08-24"
draft: true
tags: ["cyber-security"]
---

## tl;dr

First post in a journey on creating an app around what to wear to run depepdning on the weather, type of run, the person etc
Starting off with a python cli app, plan is to move to a web app with flask, use AWS to host. Maybe then try some other langagues.
At the same time I wanted to bake security in, espically using GitHub workflows. The idea being to help those developing, espically on GitHub and Opensource.

At the end I need to add this all together into a summary/checklist etc, but for now I want to document as I go.

Goes without saying basic security hygiene, keep OS/apps up to date, password manager, 2FA etc. Take a look at [this previous post](/posts/setting-up-a-password-manager)

To that end check out some basics of securing your GitHub account.
[https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-strong-password](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-strong-password)

[https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication)

[https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)

[https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)

Specifics for securing your respositry:
[https://docs.github.com/en/code-security/getting-started/github-security-features](https://docs.github.com/en/code-security/getting-started/github-security-features)

This includes:

- Adding a security.md to let users know of supported version and how to communicate security vulnerabilities - issues aren't the best place as they are too public
- The dependency graph and dependabot alerts are already enabled. But you can enable Dependabot version updates
- Code scanning with CodeQL
- Secret scanning is enabled by default for public repositories too

For this demo I'm using the repository [https://github.com/mrjonstrong/upgraded-disco](https://github.com/mrjonstrong/upgraded-disco) which is a hello world python app (for now).

Some repository basics (already added a security.md as above):

- [Readme](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)

- [License](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)

- [Sponsor button (Hey you never know!)](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/displaying-a-sponsor-button-in-your-repository)

- [Image for link previews](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview)

- [Topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)

- [Codeowners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

- [Citation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-citation-files)

- [Actions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository) - Here whilst the default setting is fairly good. You could change "Allowing select actions and reusable workflows to run". Allow GitHub Actions and those in the Market Place from verified creators. There is also room to add specific actions you want to run to the list later on if need be.

I'm going to use [GitFlow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow), just because I like the idea of the main branch being what is released in production and having a develop branch to add features and bugfixes too. Other Git workflows are available ;)

I mention this as it moves us on to how we can secure our branches in GitHub. With [branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

As well as protecting the main branch, protecting the develop branch too is worth it, at least to a point.

For main and develop branches

- By default administrators not inlcudede in branch protection - include them. 'By default, the restrictions of a branch protection rule don't apply to people with admin permissions to the repository or custom roles with the "bypass branch protections" permission. You can optionally apply the restrictions to administrators and roles with the "bypass branch protections" permission, too.'
- By default, you cannot [delete a protected branch](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#allow-deletions). Leave the default.
- By default, [GitHub blocks force pushes on all protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#allow-force-pushes). Leave the default.
- [Require signed commits](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-signed-commits), for most individual users, GPG or SSH will be the best choice for signing commits. SSH signatures are the simplest to generate. You can even upload your existing authentication key to GitHub Enterprise Cloud to also use as a signing key. Generating a GPG signing key is more involved than generating an SSH key, but GPG has features that SSH does not. A GPG key can expire or be revoked when no longer used. GitHub Enterprise Cloud shows commits that were signed with such a key as "Verified" unless the key was marked as compromised. SSH keys don't have this capability.
  When using the Rebase and Merge option on a pull request, it's important to note that the commits in the head branch are added to the base branch without commit signature verification. When you use this option, GitHub creates a modified commit, using the data and content of the original commit. This means that GitHub didn't truly create this commit, and can't therefore sign it as a generic system user. GitHub doesn't have access to the committer's private signing keys, so it can't sign the commit on the user's behalf.
  A workaround for this is to rebase and merge locally, and then push the changes to the pull request's base branch.
  [About commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)

For main, optionally develop

- [Require pull request reviews before merging](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-pull-request-reviews-before-merging). Select at least 1 reviewer, but 2 or more reviewers would be better.
- Dismiss stale pull request approvals when new commits are pushed
- [Require status checks to pass before merging](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging) and then select 'Require branches to be up to date before merging'
- [Require review from Code Owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Require conversation resolution before merging](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-conversation-resolution-before-merging)

To consider

- <https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-deployments-to-succeed-before-merging>

You can set up Environments and protect them - [Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)

[Keeping your GitHub Actions and workflows secure](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/)
See also [Understanding the risk of script injections](https://docs.github.com/en/actions/concepts/security/script-injections)

Whilst not security related, following best practices for open source projects - [recommended community standards](https://opensource.guide/).

The OSS Scorecard is worth following. They have an action you can add to help highlight improvements to make [https://github.com/ossf/scorecard](https://github.com/ossf/scorecard)

The OSS Scorecard helps to identify [dangerous workflows](https://github.com/ossf/scorecard/blob/main/docs/checks.md#dangerous-workflow). See [Vulnerable GitHub Actions Workflows Part 1: Privilege Escalation Inside Your CI/CD Pipeline](https://www.legitsecurity.com/blog/github-privilege-escalation-vulnerability)
Restrict the GitHub token permissions only to the required ones; this way, even if the attackers will succeed in compromising your workflow, they won't be able to do much.
Use workflow input as environment variables instead of interpolation. This will prevent script injection.
Never check out user code, code execution might happen in many ways, some of which are very hard to detect thus avoiding checkout is highly recommended.
If possible, check that the triggering workflow doesn't belong to a forked repository, and if it does require human approval as explained in this blog post: [Using Environment Protection Rules to Secure Secrets When Building External Forks with pull_request_target](https://dev.to/petrsvihlik/using-environment-protection-rules-to-secure-secrets-when-building-external-forks-with-pullrequesttarget-hci)

If you use third-party actions it's highly recommended you take the following actions:

- Limit GitHub token to the minimum required permissions
- Pin the action to a specific commit
- Allow only specific actions to be used in your organization
- Read the action source code before using it

As per

Use [harden runner](https://github.com/step-security/harden-runner) to secure workflows. [app.stepsecurity.io](app.stepsecurity.io)

Scan against your public repositories for security issues in public workflows - just a basic PAT will do [https://github.com/TinderSec/gh-workflow-auditor](https://github.com/TinderSec/gh-workflow-auditor)
