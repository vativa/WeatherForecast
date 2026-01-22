# Git / GitHub practices (the role of main and how to update origin/main)
- **`origin/main` is protected and must only change via GitHub Pull Requests (PRs)**
    - Do **not** push directly to `main` (no `git push origin main`)
    - Do **not** merge locally into `main` and push
    - The only allowed way to update `origin/main` is: **create a feature branch → open a PR → merge the PR in GitHub UI**

- **Branching rule (mandatory):**
    - For every task, create a new branch from the latest `origin/main`:
        - `git fetch origin`
        - `git switch main && git reset --hard origin/main` (or `git pull --ff-only` if clean/fast-forwardable)
        - `git switch -c feature/<short-name>`
    - All commits must go to the feature branch
    - Commit messages in history are short, imperative, and capitalized (e.g., “Update .gitignore”)

- **Pullrequest & rules (mandatory):**
    - PRs should include a clear summary, testing steps (`npm run test`/`npm run lint`),
      and screenshots for UI changes
    - Push only the feature branch: `git push -u origin feature/<short-name>`
    - Open a PR against `main`
    - Ensure CI checks pass and resolve review comments
    - Squash merge the PR **in GitHub**

- **Keep branches up to date without touching local `main`:**
    - Update feature branches by rebasing onto the latest `origin/main`:
        - `git fetch origin`
        - `git rebase origin/main`
    - If rebase is not allowed, merge `origin/main` into the feature branch (still never into local `main`):
        - `git fetch origin`
        - `git merge origin/main`

- **Local `main` is read-only:**
    - Never commit on `main`
    - Never keep work on `main`
    - `main` is only used to track `origin/main` (fast-forward/reset to match remote) and as the base for new feature branches
