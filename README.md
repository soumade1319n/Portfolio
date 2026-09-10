# Portfolio

This is a simple static portfolio site.

Contents:
- index.html
- style.css
- script.js

How to publish to GitHub:

1. Initialize and commit (already done):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

2. Create a GitHub repo and push (choose one):

- Using GitHub CLI (recommended):

```bash
gh repo create <username>/<repo-name> --public --source=. --remote=origin --push
```

- Or manually add remote and push:

```bash
git remote add origin git@github.com:<username>/<repo-name>.git
git push -u origin main
```

If you'd like, I can create the remote repo and push for you (requires `gh` and that you're signed in).