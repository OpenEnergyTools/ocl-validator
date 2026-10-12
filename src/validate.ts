import { ValidationIssue } from './ValidationIssue';
import * as requiredElements from './RequiredElements';
import * as requiredAttributes from './RequiredAttributes';

export type ValidationOptions = {
    filename?: string;
    filter?: {
        element_specific?: boolean;
        attributes_specific?: boolean;
        semantic_checks?: boolean;
        file_specific?: boolean;
    };
};

/**
 * Validates an XMLDocument against selected OCL rule categories using parallel execution.
 * Uses AsyncGenerator to stream results.
 *
 * @param scl - The XMLDocument to validate
 * @param options - Validation options including filename and category selectors
 * @yields Arrays of ValidationIssue as rule categories complete
 */
export async function* validate(
    scl: XMLDocument,
    options: ValidationOptions = {}
): AsyncGenerator<ValidationIssue[], void, void> {
    const filename = options.filename || 'unknown.xml';

    // Run selected rule categories in parallel
    const filter = options.filter || {};
    const categories = [
        { enabled: filter.element_specific !== false, run: () => runRequiredElements(scl, filename) },
        { enabled: filter.attributes_specific !== false, run: () => runRequiredAttributes(scl, filename) },
    ];

    // Run all enabled categories in parallel
    const results = await Promise.all(
        categories.filter((c) => c.enabled).map((c) => c.run())
    );

    // Yield each category's results if they have issues
    for (const issues of results) {
        if (issues.length > 0) {
            yield issues;
        }
    }
}

/**
 * Runs all RequiredElements validation functions in parallel.
 *
 * @param scl - The XMLDocument to validate
 * @param filename - The filename to include in validation issues
 * @returns Promise resolving to all issues found
 */
async function runRequiredElements(scl: XMLDocument, filename: string): Promise<ValidationIssue[]> {
    const ruleFunctions = Object.values(requiredElements).filter(
        (fn): fn is (doc: XMLDocument, name: string) => ValidationIssue[] => typeof fn === 'function'
    );

    // Run all RequiredElements rules in parallel
    const results = await Promise.all(ruleFunctions.map((rule) => rule(scl, filename)));

    // Flatten the array of arrays into a single array
    return results.flat();
}

/**
 * Runs all RequiredAttributes validation functions in parallel.
 *
 * @param scl - The XMLDocument to validate
 * @param filename - The filename to include in validation issues
 * @returns Promise resolving to all issues found
 */
async function runRequiredAttributes(scl: XMLDocument, filename: string): Promise<ValidationIssue[]> {
    const ruleFunctions = Object.values(requiredAttributes).filter(
        (fn): fn is (doc: XMLDocument, name: string) => ValidationIssue[] => typeof fn === 'function'
    );

    // Run all RequiredAttributes rules in parallel
    const results = await Promise.all(ruleFunctions.map((rule) => rule(scl, filename)));

    // Flatten the array of arrays into a single array
    return results.flat();
}

/**
 * Collects all validation issues into a single array.
 * Useful when you want all issues at once rather than streaming.
 *
 * @param scl - The XMLDocument to validate
 * @param options - Validation options
 * @returns Promise resolving to all validation issues
 */
export async function validateAll(scl: XMLDocument, options: ValidationOptions = {}): Promise<ValidationIssue[]> {
    const allIssues: ValidationIssue[] = [];

    for await (const issues of validate(scl, options)) {
        allIssues.push(...issues);
    }

    return allIssues;
}
