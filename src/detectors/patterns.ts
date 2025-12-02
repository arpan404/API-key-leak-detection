import { DetectionPattern } from '../types';

export const detectionPatterns: DetectionPattern[] = [
    // AWS Access Keys
    {
        name: 'AWS Access Key ID',
        pattern: /AKIA[0-9A-Z]{16}/g,
        severity: 'critical',
        description: 'AWS Access Key ID detected',
    },
    {
        name: 'AWS Secret Access Key',
        pattern: /aws_secret_access_key\s*=\s*['"]?([A-Za-z0-9/+=]{40})['"]?/gi,
        severity: 'critical',
        description: 'AWS Secret Access Key detected',
    },

    // Google API Keys
    {
        name: 'Google API Key',
        pattern: /AIza[0-9A-Za-z\\-_]{35}/g,
        severity: 'high',
        description: 'Google API Key detected',
    },
    {
        name: 'Google OAuth',
        pattern: /[0-9]+-[0-9A-Za-z_]{32}\.apps\.googleusercontent\.com/g,
        severity: 'high',
        description: 'Google OAuth Client ID detected',
    },

    // GitHub Tokens
    {
        name: 'GitHub Personal Access Token',
        pattern: /ghp_[0-9a-zA-Z]{36}/g,
        severity: 'critical',
        description: 'GitHub Personal Access Token detected',
    },
    {
        name: 'GitHub OAuth Token',
        pattern: /gho_[0-9a-zA-Z]{36}/g,
        severity: 'critical',
        description: 'GitHub OAuth Token detected',
    },
    {
        name: 'GitHub App Token',
        pattern: /ghs_[0-9a-zA-Z]{36}/g,
        severity: 'critical',
        description: 'GitHub App Token detected',
    },

    // Slack Tokens
    {
        name: 'Slack Token',
        pattern: /xox[baprs]-[0-9]{10,12}-[0-9]{10,12}-[0-9a-zA-Z]{24,32}/g,
        severity: 'high',
        description: 'Slack Token detected',
    },
    {
        name: 'Slack Webhook',
        pattern: /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]+\/B[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+/g,
        severity: 'high',
        description: 'Slack Webhook URL detected',
    },

    // Private Keys
    {
        name: 'RSA Private Key',
        pattern: /-----BEGIN RSA PRIVATE KEY-----/g,
        severity: 'critical',
        description: 'RSA Private Key detected',
    },
    {
        name: 'SSH Private Key',
        pattern: /-----BEGIN OPENSSH PRIVATE KEY-----/g,
        severity: 'critical',
        description: 'SSH Private Key detected',
    },
    {
        name: 'PGP Private Key',
        pattern: /-----BEGIN PGP PRIVATE KEY BLOCK-----/g,
        severity: 'critical',
        description: 'PGP Private Key detected',
    },

    // JWT Tokens
    {
        name: 'JWT Token',
        pattern: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,
        severity: 'medium',
        description: 'JWT Token detected',
    },

    // Database Connection Strings
    {
        name: 'MongoDB Connection String',
        pattern: /mongodb(\+srv)?:\/\/[^\s]+/gi,
        severity: 'critical',
        description: 'MongoDB connection string detected',
    },
    {
        name: 'PostgreSQL Connection String',
        pattern: /postgres(ql)?:\/\/[^\s]+/gi,
        severity: 'critical',
        description: 'PostgreSQL connection string detected',
    },
    {
        name: 'MySQL Connection String',
        pattern: /mysql:\/\/[^\s]+/gi,
        severity: 'critical',
        description: 'MySQL connection string detected',
    },

    // API Keys (Generic)
    {
        name: 'Generic API Key',
        pattern: /['"](api[_-]?key|apikey|api[_-]?secret)['"]\s*[:=]\s*['"]([a-zA-Z0-9_\-]{20,})['"]?/gi,
        severity: 'high',
        description: 'Generic API Key detected',
    },
    {
        name: 'Generic Secret',
        pattern: /['"](secret|password|passwd|pwd)['"]\s*[:=]\s*['"]([^'"]{8,})['"]?/gi,
        severity: 'high',
        description: 'Generic secret or password detected',
    },

    // Stripe Keys
    {
        name: 'Stripe API Key',
        pattern: /sk_live_[0-9a-zA-Z]{24,}/g,
        severity: 'critical',
        description: 'Stripe Live API Key detected',
    },
    {
        name: 'Stripe Publishable Key',
        pattern: /pk_live_[0-9a-zA-Z]{24,}/g,
        severity: 'medium',
        description: 'Stripe Publishable Key detected',
    },

    // Twilio
    {
        name: 'Twilio API Key',
        pattern: /SK[0-9a-fA-F]{32}/g,
        severity: 'high',
        description: 'Twilio API Key detected',
    },

    // SendGrid
    {
        name: 'SendGrid API Key',
        pattern: /SG\.[0-9A-Za-z\-_]{22}\.[0-9A-Za-z\-_]{43}/g,
        severity: 'high',
        description: 'SendGrid API Key detected',
    },

    // MailChimp
    {
        name: 'MailChimp API Key',
        pattern: /[0-9a-f]{32}-us[0-9]{1,2}/g,
        severity: 'high',
        description: 'MailChimp API Key detected',
    },

    // Azure
    {
        name: 'Azure Storage Account Key',
        pattern: /DefaultEndpointsProtocol=https;AccountName=[^;]+;AccountKey=[^;]+/gi,
        severity: 'critical',
        description: 'Azure Storage Account Key detected',
    },

    // Heroku
    {
        name: 'Heroku API Key',
        pattern: /(heroku[_-]?api[_-]?key|HEROKU[_-]?API[_-]?KEY|Authorization:\s*Bearer)\s*[:=]?\s*['"]?([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})['"]?/gi,
        severity: 'high',
        description: 'Heroku API Key detected',
    },
    // Universal AI Keys (OpenAI, Anthropic, etc.)
    {
        name: 'Universal AI API Key',
        pattern: /sk-[a-zA-Z0-9]{20,}/g,
        severity: 'critical',
        description: 'Universal AI API Key (sk-...) detected',
    },

    // Generic High-Entropy Assignments
    {
        name: 'Potential API Key Assignment',
        pattern: /(api_?key|access_?token|secret_?key|auth_?token)\s*[:=]\s*['"]([a-zA-Z0-9_\-]{32,})['"]/gi,
        severity: 'high',
        description: 'Potential API Key assignment detected',
    },
    {
        name: 'Bearer Token',
        pattern: /Bearer\s+[a-zA-Z0-9\-\._~\+\/]{20,}/g,
        severity: 'medium',
        description: 'Bearer Token detected',
    },
];
