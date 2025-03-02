# Contributing to Squircle.js

Thank you for your interest in contributing to **Squircle.js**! Your contributions help improve the project and make it more useful for everyone. Below are the guidelines to help you get started.

## Getting Started

1. **Fork the Repository**: Start by forking the repository on GitHub.
2. **Clone Your Fork**:
   ```sh
   git clone https://github.com/bring-shrubbery/squircle-js.git
   ```
3. **Install Dependencies**: Navigate into the project directory and install dependencies:
   ```sh
   cd squircle-js
   pnpm install
   ```
4. **Create a Feature Branch**: Use a meaningful branch name:
   ```sh
   git checkout -b feature/your-feature-name
   ```

## Submitting Changes

1. **Commit Your Changes**: Follow the conventional commit message format:
   ```sh
   git commit -m "feat: add new feature description"
   ```
2. **Push to Your Fork**:
   ```sh
   git push origin feature/your-feature-name
   ```
3. **Open a Pull Request**:
   - Go to the original repository on GitHub.
   - Navigate to the **Pull Requests** tab.
   - Click **New Pull Request**.
   - Select your branch and describe your changes.
   - Submit the pull request for review.

## Versioning

Squircle.js uses **Changesets** for versioning and releasing new updates. When making changes, please follow these steps:

1. **Add a Changeset**: Run the following command to generate a changeset:
   ```sh
   pnpm changeset
   ```
2. **Select the affected packages** and describe your changes.
3. **Commit the changeset file** along with your code changes.

Changesets ensure that version bumps and changelogs are generated correctly before releases.

## Reporting Issues

If you encounter a bug or have a feature request, please open an issue on GitHub:

- Go to the **Issues** tab in the repository.
- Click **New Issue**.
- Provide a clear title and detailed description.
- Add relevant labels (e.g., bug, enhancement).

## Code Guidelines

- Follow the existing code style.
- Write clear and concise comments where necessary.
- Ensure your changes do not introduce new errors or break existing functionality.

## Testing

Before submitting a pull request, please ensure your changes pass all tests:

```sh
pnpm test
```

## Deployment

Squircle.js is deployed on **Vercel**. The maintainers will handle deployments, so no direct action is needed from contributors.

## License

By contributing, you agree that your contributions will be licensed under the project's existing [MIT License](LICENSE).

---

We appreciate your contributions! 🎉
