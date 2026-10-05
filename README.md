# @openenergytools/ocl-validator

[![CI](https://github.com/OpenEnergyTools/ocl-validator/actions/workflows/test.yml/badge.svg)](https://github.com/OpenEnergyTools/ocl-validator/actions)
[![Test Coverage](https://img.shields.io/badge/test_coverage-89%25-brightgreen)](https://github.com/OpenEnergyTools/ocl-validator/actions/workflows/test.yml)

IEC 61850 OCL (Object Constraint Language) validator for SCL files. Validates XML documents against OCL rules for substation configuration language.

## Installation

```bash
npm install @openenergytools/ocl-validator
```

## Usage

### Basic Usage

```typescript
import { validate, validateAll, ValidationIssue } from '@openenergytools/ocl-validator';

// Parse your SCL XML
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(sclXmlString, 'text/xml');

// Stream validation results
for await (const issues of validate(xmlDoc, { filename: 'my-file.scd' })) {
    console.log(`Found ${issues.length} issues`);
    issues.forEach(issue => {
        console.log(`- ${issue.severity}: ${issue.message} (${issue.id})`);
    });
}

// Or get all issues at once
const allIssues = await validateAll(xmlDoc, { filename: 'my-file.scd' });
console.log(`Total issues: ${allIssues.length}`);
```

### API

#### `validate(scl: XMLDocument, options?: ValidationOptions): AsyncGenerator<ValidationIssue[], void, void>`

Validates an XMLDocument against OCL rules using parallel execution. Uses AsyncGenerator to stream results as validation progresses.

**Parameters:**
- `scl`: The XMLDocument to validate
- `options.filename`: Optional filename to include in validation issues (default: 'unknown.xml')

**Yields:** Arrays of ValidationIssue as validation progresses

#### `validateAll(scl: XMLDocument, options?: ValidationOptions): Promise<ValidationIssue[]>`

Convenience function that collects all validation issues into a single array.

**Parameters:**
- `scl`: The XMLDocument to validate  
- `options.filename`: Optional filename to include in validation issues (default: 'unknown.xml')

**Returns:** Promise resolving to all validation issues

#### `ValidationIssue`

```typescript
interface ValidationIssue {
    severity: 'ERROR' | 'WARNING' | 'INFO';
    id: string; // Rule identifier
    filename: string; // Source filename
    message: string; // Error message
    element: Element; // The DOM element that caused the issue
}
```

### Currently Supported Rules

- **RequiredElements**: All rules that validate required elements are included

## Parallel Execution

The validator runs all RequiredElements rules in parallel for optimal performance, using `Promise.all()` to maximize throughput while maintaining correctness.

## Browser Support

This package works in both Node.js and browser environments. The DOM API (XMLDocument, Element) is used throughout.

## Development

```bash
# Build
npm run build

# Test
npm run test

# Test with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## License

Apache-2.0