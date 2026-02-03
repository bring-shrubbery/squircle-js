# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

squircle-js is a monorepo that brings iOS-style squircles (smooth corners) to React projects. The main package `@squircle-js/react` uses `figma-squircle` to generate SVG clip-paths that create the smooth corner effect impossible with CSS alone.

## Monorepo Structure

- `packages/squircle-element-react/` - Main React component library (@squircle-js/react)
- `apps/web/` - Next.js documentation/demo site
- `tooling/` - Shared TypeScript and Tailwind configs

## Common Commands

```bash
# Development
pnpm install              # Install dependencies (uses pnpm@9.6.0)
pnpm build                # Build all packages via Turbo
pnpm dev                  # Watch mode for development

# Code Quality
pnpm typecheck            # Type check all packages

# Releases
pnpm changeset            # Create a changeset for versioning
pnpm changeset:version    # Bump versions based on changesets
pnpm changeset:release    # Build and publish to npm
```

## Core Architecture

The main component (`packages/squircle-element-react/src/index.tsx`) works by:
1. Measuring element size via ResizeObserver (custom `useElementSize` hook)
2. Generating an SVG path using `figma-squircle` based on dimensions and corner props
3. Applying the path as a CSS clip-path

**Component Variants:**
- `Squircle` - Dynamic component with ResizeObserver for responsive sizing
- `StaticSquircle` - For known dimensions (no size observation, better performance)
- `SquircleNoScript` - Fallback styles when JavaScript is disabled

**Key Props:**
- `cornerRadius` - Corner radius in pixels
- `cornerSmoothing` - Smoothing intensity (default: 0.6)
- `asChild` - Uses Radix UI Slot pattern for composition

## Build Configuration

- **tsup** bundles the library (CJS + ESM formats)
- **Turbo** orchestrates monorepo tasks
- **Changesets** manages versioning and npm publishing via GitHub Actions

## Known Limitations

- Does not support `border-width` (works with background colors only)
- CSS `superellipse()` has limited browser support (reason for JS-based approach)
