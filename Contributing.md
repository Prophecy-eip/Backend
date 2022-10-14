# Contributing to Prophecy-eip/Backend

## Rules

- **NEVER push on `master` branch.**
- **ALWAYS use Pull Requests hen adding nex features or bug fix.**
- **ALWAYS merge on the sprint branch (branch name starting with `sprint_`).**

## Convention

### Branch names

Use the following convention for branch names:
- `<type>_<issue_number>_<description>`

**Example**: `feat_123_add-x-feature`

> Consider using one branch per issue.

### Commits
Follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to write your commit messages.

#### Guidelines
- Group Commits: Each commit should represent a meaningful change (e.g. implement feature X, fix bug Y, ...).
- For instance, a PR should **not** look like *1) Add Feature 2) Fix Typo 3) Changes to feature X 4) Bug fix for feature X 5)...*<br>
  Instead, these commits should be squashed together into a single "Add Feature" commit.
- Each commit should work on its own: It must compile, pass the tests and so on.
- Use `git rebase master` to group commits together and rewrite their commit messages.
- To add changes to the previous commit, use `git commit --amend`. This will change the last commit (amend) instead of creating a new commit.

## GitHub workflow

The recommended workflow is to clone the repository from `Prophecy-eip/Backend` and open pull requests directly from the repository.

### 1 - Clone the repository

```shell
git clone git@github.com:Prophecy-eip/Backend.git
```

### 2 - Create a Pull Request

```shell
# Create a new branch
git checkout -b mybranch

# Make changes to your branch
# ...

# Add your changes
git add <filenames>

# Commit your change
git commit -m "feat(feature X): Add new feature that will take us to a better world"

# Push your change
git push
```

### 3 - Retrieve updates from master

```shell
# Go to master
git checkout master

# Pull changes
git pull

# Go to working branch
git checkout working-branch

# Rebase from master
git rebase master

# Apply rebase
git push -f
```

## Database migrations

Provide the migration file in `./src/database/migration`, and follow [typeorm's instructions](https://typeorm.io/migrations#creating-a-new-migration).

To run the migration, run the following command:
```shell
yarn run typeorm migration:create ./src/database/migration/PostRefactoring
```

---
[Back to README](./README.md)
