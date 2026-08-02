#!/bin/bash

# Non-interactive shells (e.g. git hooks) don't source the interactive-only
# part of ~/.bashrc, so global npm/pnpm install dirs may be missing from PATH,
# and `node` may resolve to an older system install instead of the
# nvm-managed version pnpm requires.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH="$HOME/.npm-global/bin:$HOME/.local/share/pnpm:$PATH"

# Pre-deployment validation script
echo "🔍 Running pre-deployment checks..."

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed"
    exit 1
fi

# Run type checking
echo "📝 Running TypeScript type checking..."
if ! pnpm run typecheck; then
    echo "❌ TypeScript type checking failed"
    exit 1
fi
echo "✅ TypeScript type checking passed"

# Run linter
echo "🧹 Running linter..."
if ! pnpm run lint; then
    echo "❌ Linting failed"
    exit 1
fi
echo "✅ Linting passed"

# Run tests
echo "🧪 Running tests..."
if ! pnpm test:run; then
    echo "❌ Tests failed"
    exit 1
fi
echo "✅ Tests passed"

# Run build
echo "🏗️  Building project..."
if ! pnpm run build; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"

# Check if dist directory exists and has content
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    echo "❌ Build output directory is empty or missing"
    exit 1
fi
echo "✅ Build output verified"

# Optional: Run additional checks
echo "🔍 Running additional validations..."

# Check for common security issues (if package.json audit is available)
echo "🔒 Running security audit..."
if pnpm audit --audit-level moderate; then
    echo "✅ Security audit passed"
else
    echo "⚠️  Security audit found issues (continuing...)"
fi

echo "🎉 All validations completed successfully!"
exit 0
