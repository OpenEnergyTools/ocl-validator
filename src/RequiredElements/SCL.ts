import { ValidationIssue } from '../ValidationIssue';

// Rule: SCL_one_Header_required
export function sCL_one_Header_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    const root = scl.documentElement;
    const header = root.querySelector('Header');

    return header
        ? []
        : [
              {
                  severity: 'ERROR',
                  id: 'SCL_one_Header_required',
                  filename: docName,
                  message: 'SCL shall contain an Header',
                  element: root,
              },
          ];
}
