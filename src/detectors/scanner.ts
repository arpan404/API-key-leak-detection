import { Detection } from '../types';
import { detectionPatterns } from './patterns';

export class SecurityScanner {
    /**
     * Scans text content for sensitive data and API key leaks
     */
    public scan(text: string, source: string = 'Inline'): Detection[] {
        const detections: Detection[] = [];

        for (const pattern of detectionPatterns) {
            const matches = text.matchAll(pattern.pattern);

            for (const match of matches) {
                const matchText = match[0];
                const index = match.index || 0;

                // Calculate line and column
                const beforeMatch = text.substring(0, index);
                const line = beforeMatch.split('\n').length;
                const lastNewline = beforeMatch.lastIndexOf('\n');
                const column = index - lastNewline;

                // Get context (surrounding lines)
                const lines = text.split('\n');
                const contextStart = Math.max(0, line - 2);
                const contextEnd = Math.min(lines.length, line + 1);
                const context = lines.slice(contextStart, contextEnd).join('\n');

                detections.push({
                    type: pattern.name,
                    severity: pattern.severity,
                    match: this.maskSensitiveData(matchText),
                    line,
                    column,
                    context: this.maskSensitiveData(context),
                    description: pattern.description,
                    source,
                });
            }
        }

        return detections;
    }

    /**
     * Masks sensitive data for display purposes
     */
    private maskSensitiveData(text: string): string {
        if (text.length <= 8) {
            return '*'.repeat(text.length);
        }
        const visibleChars = 4;
        const start = text.substring(0, visibleChars);
        const end = text.substring(text.length - visibleChars);
        const masked = '*'.repeat(Math.max(0, text.length - visibleChars * 2));
        return `${start}${masked}${end}`;
    }

    /**
     * Scans DOM elements for code content
     */
    public scanElement(element: Element): Detection[] {
        const text = element.textContent || '';
        return this.scan(text, 'Inline');
    }

    /**
     * Gets statistics from detections
     */
    public getStats(detections: Detection[]): {
        total: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
    } {
        return {
            total: detections.length,
            critical: detections.filter(d => d.severity === 'critical').length,
            high: detections.filter(d => d.severity === 'high').length,
            medium: detections.filter(d => d.severity === 'medium').length,
            low: detections.filter(d => d.severity === 'low').length,
        };
    }
}
