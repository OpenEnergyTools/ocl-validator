export type Severity = 'ERROR' | 'WARNING' | 'INFO';

/**
 * A single OCL rule violation, mirroring the tuple produced by the
 * RiseClipse OCL constraints ('severity;id;filename;lineNumber;message'),
 * with the faulty element pointer replacing the line number.
 */
export interface ValidationIssue {
    /** Severity declared by the OCL rule. */
    severity: Severity;
    /** Rule identifier, e.g. 'ReportControl_one_OptFields_required'. */
    id: string;
    /** Name of the validated document, passed in by the caller. */
    filename: string;
    /** The message text stated in the OCL rule. */
    message: string;
    /** The element that violates the rule. */
    element: Element;
}

/**
 * An OCL rule: validates a document and returns one issue per
 * violating element. An empty array means the document is valid.
 */
export type ValidationRule = (scl: XMLDocument, docName: string) => ValidationIssue[];
