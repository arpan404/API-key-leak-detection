export interface DetectionPattern {
    name: string;
    pattern: RegExp;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
}

export interface Detection {
    type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    match: string;
    line?: number;
    column?: number;
    context?: string;
    description: string;
    source: string; // URL or "Inline"
}

export interface ScanResult {
    detections: Detection[];
    scannedAt: number;
    url: string;
}
