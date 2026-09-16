# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Folder Structure

### App

### Components

### Config

Shared framework specific data, such as page navigation constants.

### Context

Shared react context for different app concerns.

### Models

Shared schemas that both define expected data structures as well as runtime type checks.

### Services

Interfaces that define boundary behaviors.

### Infrastructure

Live external implementations of internal services.

### Utils

Shared first party code.

### Lib

Shared third party code.

### Hooks

Shared react hooks that abstract repeated state into shareable utilities.
