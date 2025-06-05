# Contributing to Dominican Republic E-Ticket System

## Overview

This project modernizes the Dominican Republic's E-Ticket system for migration control, serving **millions of users annually**. Every contribution must prioritize **performance**, **security**, **cost efficiency**, and exceptional **user experience**.

## 🎯 Core Principles

### 1. Only-Once Approach (OOTS Guidelines)

Following the [EU Once-Only Technical System UX Guidelines](https://ec.europa.eu/digital-building-blocks/sites/display/OOTS/Welcome+to+the+OOTS+UX+guidelines):

- **Never ask users for information they've already provided**
- **Reuse data intelligently** across form sections
- **Pre-populate fields** whenever possible using:
  - Previously entered data in the same session
  - OCR-extracted passport information
  - Browser localStorage for non-sensitive preferences
- **Smart form logic** to conditionally show/hide fields based on previous answers
- **Remember user preferences** (language, accessibility settings) without requiring re-selection

### 2. Performance-First Development

With millions of annual users, every millisecond counts:

- **Bundle size optimization** is critical - use dynamic imports and code splitting
- **Minimize external API calls** - prefer local data processing and caching
- **Optimize images** - use Next.js Image component with proper sizing
- **Implement proper caching strategies** at all levels
- **Monitor Core Web Vitals** - target LCP < 2.5s, FID < 100ms, CLS < 0.1

### 3. Cost-Efficient Architecture

Minimize operational costs through smart design decisions:

- **Local-first data processing** - perform validations, calculations, and transformations client-side when possible
- **Batch API requests** - never make individual API calls in loops
- **Cache aggressively** - use appropriate cache headers and strategies
- **Optimize database operations** - minimize read/write operations, use efficient queries
- **Implement request deduplication** for concurrent identical requests

### 4. Security by Design

Handle sensitive traveler data with utmost care:

- **Data minimization** - collect only essential information
- **Input validation** at both client and server levels using Zod schemas
- **Sanitize all user inputs** before processing or storage
- **Implement proper authentication flows** with Auth
- **Use HTTPS everywhere** - no exceptions
- **Follow OWASP Top 10** security guidelines

## 🛠 Technical Guidelines

### Code Standards

#### TypeScript

```typescript
// ✅ Good: Strict typing with proper interfaces
interface TravelerData {
  passportNumber: string;
  nationality: string;
  dateOfBirth: Date;
}

// ❌ Bad: Using 'any' or loose typing
const travelerData: any = {...};
```

#### Component Structure

```typescript
// ✅ Good: Proper component organization
export function PassportForm({ onDataChange }: PassportFormProps) {
  const form = useForm<PassportData>({
    resolver: zodResolver(passportSchema),
    defaultValues: getStoredPassportData(), // Reuse existing data
  });

  return (
    <Form {...form}>
      {/* Component JSX */}
    </Form>
  );
}

// ❌ Bad: Inline forms without proper validation
function BadForm() {
  return <input onChange={(e) => someGlobalVar = e.target.value} />;
}
```

### Performance Guidelines

#### 1. External API Usage

```typescript
// ✅ Good: Minimize external calls, use local data first
const validatePassport = (passportNumber: string) => {
  // First: Local format validation
  if (!PASSPORT_FORMAT_REGEX.test(passportNumber)) {
    return { valid: false, error: 'Invalid format' };
  }
  
  // Only if absolutely necessary: External verification
  // return await externalPassportAPI.verify(passportNumber);
};

// ❌ Bad: Immediate external API call
const validatePassport = async (passportNumber: string) => {
  return await externalAPI.validate(passportNumber); // Expensive!
};
```

#### 2. Client-Side Processing

```typescript
// ✅ Good: Process data locally when possible
const calculateStayDuration = (arrival: Date, departure: Date) => {
  return Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
};

// ✅ Good: Local country/city data
const COUNTRIES_DATA = [
  { code: 'US', name: 'United States', cities: ['New York', 'Los Angeles'] },
  // ... other countries loaded locally
];
```

#### 3. Caching Strategy

```typescript
// ✅ Good: Implement proper caching
const useCountryData = () => {
  return useMemo(() => {
    return getCachedCountryData() || loadCountryDataLocally();
  }, []);
};

// ✅ Good: Session-based caching for form data
const useFormPersistence = (formId: string) => {
  const [data, setData] = useState(() => 
    getSessionStorageData(formId) || {}
  );
  
  useEffect(() => {
    saveToSessionStorage(formId, data);
  }, [data, formId]);
};
```

### Data Handling

#### Only-Once Implementation

```typescript
// ✅ Good: Smart form with data reuse
export function PersonalInfoForm({ previousData }: Props) {
  const form = useForm({
    defaultValues: {
      // Reuse passport OCR data if available
      fullName: previousData?.ocrData?.name || '',
      nationality: previousData?.ocrData?.nationality || '',
      // Reuse previous session data
      email: previousData?.contactInfo?.email || '',
    }
  });
}

// ✅ Good: Conditional field display
const shouldShowCustomsDeclaration = (travelPurpose: string) => {
  return travelPurpose === 'business' || travelPurpose === 'commercial';
};
```

#### Data Validation

```typescript
// ✅ Good: Comprehensive validation schema
const travelerSchema = z.object({
  passportNumber: z.string()
    .min(6, 'Passport number too short')
    .max(20, 'Passport number too long')
    .regex(PASSPORT_REGEX, 'Invalid passport format'),
  email: z.string().email('Invalid email format'),
  arrivalDate: z.date()
    .min(new Date(), 'Arrival date cannot be in the past')
    .max(addYears(new Date(), 1), 'Arrival date too far in future'),
});
```

### Backend Integration

#### Efficient Data Operations

```typescript
// ✅ Good: Batch operations and optimistic updates
const saveETicketData = async (ticketData: ETicketData) => {
  // Optimistic update
  updateLocalState(ticketData);
  
  try {
    // Batch related operations
    await Promise.all([
      saveTicketData(ticketData),
      updateUserPreferences(ticketData.userId),
      // Other related operations
    ]);
  } catch (error) {
    // Rollback on failure
    revertLocalState();
    throw error;
  }
};

// ✅ Good: Offline support
const initializeOfflineSupport = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
};
```

#### Authentication Strategy

```typescript
// ✅ Good: Anonymous sessions for form data
const initializeSession = async () => {
  try {
    const sessionId = await createAnonymousSession();
    return sessionId;
  } catch (error) {
    console.error('Session creation failed:', error);
    return crypto.randomUUID(); // Fallback to local UUID
  }
};
```

## 🧪 Testing Requirements

### Unit Tests

```typescript
// Required: Test all validation logic
describe('PassportValidation', () => {
  it('should validate passport number format', () => {
    expect(validatePassportFormat('A1234567')).toBe(true);
    expect(validatePassportFormat('invalid')).toBe(false);
  });
});
```

### Accessibility Tests

```typescript
// Required: Test accessibility compliance
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<FormComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 📝 Documentation Standards

### Component Documentation

```typescript
/**
 * PassportForm - Handles passport information collection with OCR support
 * 
 * @param onDataChange - Callback fired when form data changes
 * @param initialData - Previously collected data to pre-populate fields
 * @param enableOCR - Whether to show passport scanning option
 * 
 * @example
 * <PassportForm 
 *   onDataChange={(data) => updateFormData('passport', data)}
 *   initialData={existingPassportData}
 *   enableOCR={true}
 * />
 */
export function PassportForm({ onDataChange, initialData, enableOCR }: Props) {
  // Implementation
}
```

### API Documentation

```typescript
/**
 * POST /api/eticket/submit
 * 
 * Submits completed e-ticket form data
 * 
 * Cost Impact: Minimize database operations
 * Performance: < 500ms response time required
 * 
 * @param data - Validated e-ticket data (validated with eTicketSchema)
 * @returns QR code and confirmation details
 */
export async function POST(request: Request) {
  // Implementation
}
```

## 🔒 Security Checklist

- [ ] All user inputs are validated and sanitized
- [ ] No sensitive data is logged or exposed in errors
- [ ] HTTPS is enforced everywhere
- [ ] Content Security Policy is properly configured
- [ ] PII data is encrypted at rest and in transit
- [ ] Rate limiting is implemented for API endpoints

## 📊 Cost Optimization Checklist

- [ ] Use local storage for non-sensitive, temporary data
- [ ] Implement request caching and deduplication
- [ ] Optimize bundle size to reduce bandwidth costs
- [ ] Use efficient data structures and algorithms
- [ ] Implement proper error handling to prevent retry storms

## 🌍 Accessibility & Internationalization

### WCAG 2.1/2.2 AA Compliance

- [ ] All form controls have proper labels
- [ ] Color contrast ratios meet AA standards
- [ ] Keyboard navigation works throughout
- [ ] Screen reader compatibility is tested
- [ ] Focus management is implemented correctly

### Internationalization

- [ ] All text is externalized to translation files
- [ ] RTL languages are supported where needed
- [ ] Date/time formatting respects locale
- [ ] Number formatting follows local conventions
- [ ] Currency and units are localized

## 📋 Pull Request Requirements

Every pull request must:

1. Document any new external API dependencies
2. Include accessibility testing results
3. Include security consideration notes
4. Pass all automated tests and quality gates

## 🆘 Getting Help

- **Security Questions**: Review OWASP guidelines
- **Accessibility**: Use axe-core tools and test with screen readers
- **Cost Optimization**: Analyze API usage patterns and implement local-first approaches

**Remember**: Every line of code affects millions of travelers. Code with empathy, performance, and security in mind.
