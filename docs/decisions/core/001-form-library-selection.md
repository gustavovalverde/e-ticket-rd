---
status: accepted
date: 2025-06-06
story: Form library selection for complex government e-ticket application with multi-step forms, conditional logic, and extensive validation requirements
---

# TanStack Form for Long-Term Dominican Republic E-Ticket System

## Context & Problem Statement

The Dominican Republic E-Ticket system needs a form library that can handle complex government forms. The new system must support validation, field dependencies, multi-step workflows, and family/group travel features. The current system has poor user experience, data redundancy, and technical issues.

The new system must support:

- Complex field dependencies (e.g., flight number auto-populating airline and airports)
- Advanced validation with multiple error types for government compliance
- Multi-step form workflows with data persistence
- Family/group intelligence to reduce redundant data entry
- Async validation for external service integration (flight validation, passport checks)
- Strong TypeScript support for large development team
- Easy to maintain and extend over time

## Priorities & Constraints

- **Government Requirements**: Must handle complex compliance validation and error reporting
- **User Experience**: Reduce redundant data entry for family/group travel
- **Performance**: Support forms with 20+ fields without performance issues
- **Developer Experience**: Strong TypeScript support and maintainable code
- **Integration**: Must work with Shadcn/ui components (development team can handle custom integration)
- **Timeline**: Long-term project with no immediate delivery deadlines
- **Maintainability**: Code quality and extensibility matter more than rapid development

## Considered Options

- **Option 1**: React Hook Form + Zod
- **Option 2**: TanStack Form
- **Option 3**: Formik + Yup

## Decision Outcome

Chosen option: **TanStack Form**

TanStack Form has better technical features for complex government forms and offers good long-term benefits. The extra work needed for UI integration is worth it because of the advantages in form logic, validation, and developer experience.

### Expected Consequences

**Positive:**

- **Better field dependencies**: Built-in `onChangeListenTo` removes the need for manual dependency management
- **Improved error handling**: Multi-type errors with `errorMap` meet government compliance needs
- **Better async validation**: Built-in debouncing and cancellation for flight/passport validation
- **Fine-grained updates**: `Subscribe` API gives precise control over re-renders for performance
- **Form composition**: `withForm` and context APIs make clean multi-step forms
- **Future-proof**: Framework-agnostic core supports potential technology changes
- **Strong TypeScript**: Good type inference and field-level type safety

**Negative:**

- **UI integration overhead**: Additional development time for Shadcn/ui integration layer
- **Learning curve**: Team must learn render props patterns and TanStack Form concepts
- **Newer ecosystem**: Less community examples compared to React Hook Form

**Neutral:**

- **Bundle size**: Similar to React Hook Form despite extra features
- **Maintenance**: Active TanStack team with recent v1 stable release (March 2025)

## More Information

### Technical Feature Analysis

| Feature                | React Hook Form                    | TanStack Form                      | Winner              |
| ---------------------- | ---------------------------------- | ---------------------------------- | ------------------- |
| **Field Dependencies** | Manual `watch()` + `useEffect`     | Built-in `onChangeListenTo`        | **TanStack Form**   |
| **Error Handling**     | String-based only                  | Multi-type with `errorMap`         | **TanStack Form**   |
| **Async Validation**   | Manual implementation              | Built-in debouncing + cancellation | **TanStack Form**   |
| **Form Composition**   | FormProvider + external state      | `withForm` + contexts              | **TanStack Form**   |
| **UI Integration**     | Native Shadcn/ui support           | Manual render props                | **React Hook Form** |
| **Ecosystem Maturity** | 42.7k GitHub stars, extensive docs | 5k GitHub stars, newer             | **React Hook Form** |

### Implementation Strategy

**Phase 1**: Create Shadcn/ui integration layer

```typescript
const { useETicketForm } = createFormHook({
  fieldComponents: {
    TextField: ShadcnTextField,
    PassportField: ShadcnPassportField,
    FlightField: ShadcnFlightField,
  },
  fieldContext,
  formContext,
});
```

**Phase 2**: Implement government-specific validation and multi-step architecture

**Phase 3**: Advanced features (flight intelligence, family logic)

### Supporting Evidence

- [TanStack Form Official Comparison](https://tanstack.com/form/latest/docs/comparison) - Shows technical advantages over React Hook Form
- [TanStack Form v1 Announcement](https://tanstack.com/blog/announcing-tanstack-form-v1) - Confirms production readiness and active development
- [TanStack Form Linked Fields](https://tanstack.com/form/latest/docs/framework/react/guides/linked-fields) - Shows better field dependency handling
- [TanStack Form UI Libraries](https://tanstack.com/form/latest/docs/framework/react/guides/ui-libraries) - Shows integration pattern for UI libraries
- [React Form Libraries 2025 Comparison](https://blog.croct.com/post/best-react-form-libraries) - Independent analysis of TanStack Form's growing adoption

### Government Use Case Examples

**Flight Intelligence Implementation:**

```typescript
<form.Field
  name="flightNumber"
  validators={{
    onChangeAsyncDebounceMs: 300,
    onChangeAsync: async ({ value, fieldApi }) => {
      const flightData = await validateFlightWithIATA(value)
      // Auto-populate government-required fields
      fieldApi.form.setFieldValue('airline', flightData.airline)
      fieldApi.form.setFieldValue('departurePort', flightData.departure)
      return undefined
    }
  }}
/>
```

**Complex Government Validation:**

```typescript
validators={{
  onChange: ({ value }) => {
    if (!value) return { severity: 'error', code: 'REQUIRED' }
    return undefined
  },
  onBlur: async ({ value }) => {
    const validation = await validateWithICAO(value)
    return !validation.valid ? {
      severity: 'error',
      code: 'ICAO_INVALID',
      complianceLevel: 'CRITICAL',
      recommendations: validation.suggestions
    } : undefined
  }
}}
```

This decision gives the Dominican Republic E-Ticket system a modern foundation that can handle complex government requirements while providing good developer experience and maintainability.
