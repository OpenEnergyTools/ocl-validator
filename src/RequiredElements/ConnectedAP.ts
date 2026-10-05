import { ValidationIssue } from '../ValidationIssue';

// Rule: ConnectedAP_at_most_one_PhysConnTypeRedConn_required
export function connectedAP_at_most_one_PhysConnTypeRedConn_required(
    scl: XMLDocument,
    docName: string
): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('ConnectedAP'))
        .filter((connectedAP) => {
            const physConns = connectedAP.querySelectorAll('PhysConn');
            const redConnCount = Array.from(physConns).filter(
                (physConn) => physConn.getAttribute('type') === 'RedConn'
            ).length;
            return redConnCount > 1;
        })
        .map((connectedAP) => ({
            severity: 'ERROR',
            id: 'ConnectedAP_at_most_one_PhysConnTypeRedConn_required',
            filename: docName,
            message: 'Only one PhysConn type RedConn is allowed in ConnectedAP',
            element: connectedAP,
        }));
}

// Rule: ConnectedAP_at_most_one_PhysConnTypeConnection_required
export function connectedAP_at_most_one_PhysConnTypeConnection_required(
    scl: XMLDocument,
    docName: string
): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('ConnectedAP'))
        .filter((connectedAP) => {
            const physConns = connectedAP.querySelectorAll('PhysConn');
            const redConnCount = Array.from(physConns).filter(
                (physConn) => physConn.getAttribute('type') === 'RedConn'
            ).length;
            const connectionCount = Array.from(physConns).filter(
                (physConn) => physConn.getAttribute('type') === 'Connection'
            ).length;
            return redConnCount === 1 && connectionCount > 1;
        })
        .map((connectedAP) => ({
            severity: 'ERROR',
            id: 'ConnectedAP_at_most_one_PhysConnTypeConnection_required',
            filename: docName,
            message:
                'Only one PhysConn type Connection is allowed when there is one PhysConn type RedConn in ConnectedAP',
            element: connectedAP,
        }));
}
