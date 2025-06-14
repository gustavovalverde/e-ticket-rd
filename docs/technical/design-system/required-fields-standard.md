# Required Fields Standard - Design System

## Overview

This document establishes the **single source of truth** for required vs optional fields across the E-Ticket application, ensuring consistency and accessibility compliance.

## System Architecture

### **1. Centralized Requirements Definition**

All field requirements are defined in `src/lib/utils/form-utils.ts`:

```typescript
import { getFieldRequirement } from "@/lib/utils/form-utils";

// Check if any field is required
const isRequired = getFieldRequirement("personalInfo.firstName"); // true
const isOptional = getFieldRequirement("contactInfo.email"); // false
```

### **2. Automatic Detection in Components**

Components automatically detect requirements without manual configuration:

```typescript
// ✅ CORRECT: Auto-detection
<FormField
  field={field}
  label="First Name"
  placeholder="Enter your first name"
  // No need to specify 'required' - automatically detected
/>

// ✅ OVERRIDE: Manual override when needed
<FormField
  field={field}
  label="Emergency Contact"
  required={true} // Override auto-detection
/>
```

## Visual Standards

### **Required Field Indicators**

- **Visual**: Red asterisk (`*`) after the label
- **Color**: `text-destructive` (CSS variable)
- **Positioning**: `after:ml-0.5` (0.5rem margin-left)
- **Implementation**: CSS pseudo-elements for consistency

### **Optional Field Indicators**

- **No visual indicator** - clean labels
- **Behavior**: No asterisk, no special styling
- **Accessibility**: `aria-required="false"` (implicit)

## Component Patterns

### **FormField Component**

```typescript
// Standard usage - auto-detection
<form.AppField name="personalInfo.firstName">
  {(field: AnyFieldApi) => (
    <FormField
      field={field}
      label="First Name"
      placeholder="Enter your first name"
      // 'required' automatically detected as true
    />
  )}
</form.AppField>

// Optional field - auto-detection
<form.AppField name="contactInfo.preferredName">
  {(field: AnyFieldApi) => (
    <FormField
      field={field}
      label="Preferred Name"
      placeholder="How would you like to be addressed?"
      description="For personalized communications"
      // 'required' automatically detected as false
    />
  )}
</form.AppField>
```

### **FormSection Component**

```typescript
// Required section
<FormSection
  title="Personal Information"
  description="Enter your details exactly as they appear on your passport"
  required={true}
>
  {/* form fields */}
</FormSection>

// Optional section
<FormSection
  title="Contact Information"
  description="How can we reach you?"
  required={false}
>
  {/* form fields */}
</FormSection>
```

## Field Requirements Mapping

### **Contact Information** (All Optional)

- `contactInfo.preferredName` - Optional
- `contactInfo.email` - Optional
- `contactInfo.phone.number` - Optional

### **Personal Information** (All Required)

- `personalInfo.firstName` - Required
- `personalInfo.lastName` - Required
- `personalInfo.birthDate.*` - Required
- `personalInfo.passport.*` - Required

### **Travel Information** (Mixed)

- `flightInfo.travelDirection` - Required
- `flightInfo.flightNumber` - Required
- `flightInfo.confirmationNumber` - Optional

### **General Information** (Mixed)

- `generalInfo.permanentAddress` - Required
- `generalInfo.city` - Required
- `generalInfo.state` - Optional
- `generalInfo.postalCode` - Optional

## Accessibility Compliance

### **ARIA Attributes**

```typescript
// Automatically applied by FormField component
<Input
  aria-required="true"        // For required fields
  aria-invalid="false"        // Updated based on validation
  aria-describedby="field-error field-description"
/>
```

### **Screen Reader Support**

- Required fields announced as "required" by screen readers
- Error states properly associated with fields
- Description text linked to form controls

## Migration Guide

### **Step 1: Remove Manual Asterisks**

```typescript
// ❌ OLD: Manual asterisk
<Label>First Name *</Label>

// ✅ NEW: Auto-detection
<FormField
  field={field}
  label="First Name"
  // Asterisk automatically added
/>
```

### **Step 2: Update Validation Logic**

```typescript
// ✅ CORRECT: Centralized requirements
import { getFieldRequirement } from "@/lib/utils/form-utils";

const validateField = (fieldName: string, value: string) => {
  const isRequired = getFieldRequirement(fieldName);

  if (isRequired && (!value || value.trim() === "")) {
    return `${fieldName} is required`;
  }
  // Additional validation...
};
```

### **Step 3: Consistent Form Sections**

```typescript
// ✅ CORRECT: Consistent section indicators
<FormSection
  title="Personal Information"
  required={true}
>
  <FormField field={firstNameField} label="First Name" />
  <FormField field={lastNameField} label="Last Name" />
</FormSection>
```

## Testing & Validation

### **Visual Testing Checklist**

- [ ] Required fields show red asterisk after label
- [ ] Optional fields have clean labels (no asterisk)
- [ ] Consistent spacing and typography
- [ ] Proper color contrast (WCAG AA compliance)

### **Accessibility Testing**

- [ ] Screen readers announce required status
- [ ] Keyboard navigation works properly
- [ ] Error messages properly associated
- [ ] Focus indicators visible and clear

## Design Tokens

### **Colors**

- `text-destructive` - Required field asterisk color
- `text-muted-foreground` - Description text color

### **Spacing**

- `after:ml-0.5` - Asterisk margin (0.125rem)
- `gap-1.5` - Field component internal spacing

### **Typography**

- `text-sm font-medium` - Label typography
- `text-xs` - Description text size

## Benefits

### **For Developers**

- ✅ No manual asterisk management
- ✅ Centralized requirements logic
- ✅ Automatic accessibility compliance
- ✅ Consistent visual patterns

### **For Users**

- ✅ Clear visual hierarchy
- ✅ Predictable form behavior
- ✅ Better accessibility experience
- ✅ Reduced cognitive load

### **For Designers**

- ✅ Consistent design system
- ✅ Standardized component library
- ✅ Clear documentation
- ✅ Maintainable patterns

---

**Last Updated**: Form reorganization implementation
**Next Review**: After user testing feedback
