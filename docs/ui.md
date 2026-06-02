# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

Do not create custom UI components. If a UI element is needed, find the appropriate shadcn/ui component and use it. If shadcn/ui does not provide a component for a given need, use composition of existing shadcn/ui primitives.

### Adding shadcn/ui components

```bash
npx shadcn@latest add <component-name>
```

Components are installed to `src/components/ui/` and can be imported from `@/components/ui/<component-name>`.

### What this means in practice

- No custom `<Button>`, `<Input>`, `<Card>`, `<Modal>`, etc. — use the shadcn/ui equivalents.
- No styling raw HTML elements directly to approximate a component — add the shadcn/ui component instead.
- Page-level and feature-level components (e.g. a `WorkoutCard` that composes multiple shadcn/ui primitives) are fine — the restriction is on reimplementing UI primitives that shadcn/ui already provides.

## Date Formatting

Use [date-fns](https://date-fns.org/) for all date formatting. Do not use `Date.prototype.toLocaleDateString`, `Intl.DateTimeFormat`, or any other date formatting approach.

### Required format

Dates must be displayed with an ordinal day, abbreviated month, and full year:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

### Implementation

```ts
import { format } from "date-fns"

function formatDate(date: Date): string {
  const day = date.getDate()
  const suffix =
    day % 100 >= 11 && day % 100 <= 13
      ? "th"
      : day % 10 === 1
        ? "st"
        : day % 10 === 2
          ? "nd"
          : day % 10 === 3
            ? "rd"
            : "th"

  return `${day}${suffix} ${format(date, "MMM yyyy")}`
}
```

Use this utility (or a shared version of it) wherever a date is rendered to the user. Do not inline ad-hoc date formatting.
