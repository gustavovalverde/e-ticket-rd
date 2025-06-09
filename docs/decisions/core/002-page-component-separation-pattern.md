---
status: accepted
date: 2025-06-09
story: Establish clear pattern for structuring Next.js App Router pages to separate routing logic from UI components
---

# Page vs Component Separation Pattern for Next.js App Router

## Context & Problem Statement

Our Next.js App Router project embeds UI logic directly in `page.tsx` files. This creates large, hard-to-test files that mix routing concerns with presentation logic.

We need a clear pattern for organizing page files and components so the team can work consistently and maintain code over time.

## Priorities & Constraints

- **Easy to change**: Code should be simple to modify and extend
- **Reusable components**: UI parts should work in different places
- **Team consistency**: Clear patterns that everyone can follow
- **Good performance**: Smart use of Server/Client Components
- **Easy testing**: Components should test without routing complexity
- **Framework alignment**: Follow Next.js conventions

## Considered Options

- **Option 1**: Monolithic page files with all UI logic embedded in `page.tsx`
- **Option 2**: Thin controller pattern with dedicated page-level components
- **Option 3**: Hybrid approach with partial extraction of complex sections only

## Decision Outcome

Chosen option: **Thin controller pattern with dedicated page-level components**

Keep `page.tsx` files simple and move UI logic to separate components.

### Expected Consequences

**Positive:**

- **Easier to maintain**: UI and routing logic stay separate
- **Easier to test**: Components work without Next.js routing setup
- **Reusable**: Page components can be used elsewhere
- **Consistent**: Same pattern across all pages
- **Better performance**: Control over Server/Client boundaries
- **Team friendly**: Work on UI without touching routing

**Negative:**

- **Extra layer**: One more file between route and UI
- **Team learning**: Everyone needs to follow the pattern

**Neutral:**

- **File structure**: Need consistent component organization
- **Code review**: Must check pattern compliance

## More Information

### Implementation Pattern

**Page File Structure:**

```typescript
// src/app/page.tsx - ✅ Thin controller
import { LandingPage } from "@/components/landing-page";

export default function Home() {
  return <LandingPage />;
}
```

**Component Structure:**

```typescript
// src/components/landing-page.tsx - Page-level component
export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#16385d]">
      <PageHeader />
      <main>
        <HeroSection />
        <MainContent />
      </main>
    </div>
  );
}
```

### File Organization

```shell
src/
├── app/
│   ├── page.tsx              # Thin controller (3-5 lines)
│   ├── about/page.tsx        # Thin controller
│   └── application/page.tsx  # Thin controller
├── components/
│   ├── landing-page.tsx      # Page-level component
│   ├── about-page.tsx        # Page-level component
│   ├── sections/             # Section components
│   └── ui/                   # Atomic components
```

### Server/Client Component Strategy

- **Page files**: Always Server Components (routing)
- **Page-level components**: Server Components by default
- **Section components**: Server Components unless interactivity required
- **Interactive components**: Client Components only where necessary

### Performance Benefits

- **Server-side rendering**: Use Server Components when possible
- **Smaller bundles**: Less client-side JavaScript
- **Better SEO**: Server-rendered content
- **Lazy loading**: Easy to add for sections

### Supporting Evidence

This pattern follows Next.js App Router and React Server Components guidance:

- [Next.js App Router Documentation](https://nextjs.org/docs/app) - Server Components by default
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) - Official React guidance
- [Vercel App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration) - App Router patterns

### Related Decisions

- [001-form-library-selection.md](001-form-library-selection.md) - Form architecture works with this component structure
- Future ADRs will build on this pattern

This decision gives us a consistent way to structure pages that's easy to maintain and perform well.
