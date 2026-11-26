# The commands that people run. Each target calls a script in package.json or
# scripts/, so CI and a laptop run the same thing.

.PHONY: install dev build preview test test-e2e lint format hooks

install:
	yarn install --frozen-lockfile

dev:
	yarn dev

build:
	yarn build

preview: build
	yarn workspace @handyweb/web run preview

test:
	yarn test

# On a machine where the Playwright browser download is blocked, set
# PW_CHROMIUM_PATH to a local Chromium-based browser first. See README.md.
test-e2e:
	yarn test:e2e

lint:
	yarn format:check
	yarn lint
	yarn typecheck

format:
	yarn format

# Point git at the tracked hooks directory. One command, and the hooks stay in
# step with the repository instead of being copied into .git/hooks by hand.
hooks:
	git config core.hooksPath .githooks
	@echo "Hooks installed from .githooks. Undo with: git config --unset core.hooksPath"
