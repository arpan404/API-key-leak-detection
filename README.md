# Security Leak Detector - Chrome Extension

A powerful Chrome extension that detects sensitive data and API key leaks in code displayed on web pages. Built with TypeScript and Webpack for robust security scanning.

## 🔒 Features

- **Real-time Code Scanning**: Automatically scans code blocks on web pages
- **Comprehensive Detection**: Identifies 20+ types of sensitive data including:
  - AWS Access Keys & Secret Keys
  - Google API Keys & OAuth Tokens
  - GitHub Personal Access Tokens
  - Slack Tokens & Webhooks
  - Private Keys (RSA, SSH, PGP)
  - JWT Tokens
  - Database Connection Strings (MongoDB, PostgreSQL, MySQL)
  - Stripe API Keys
  - Twilio, SendGrid, MailChimp API Keys
  - Azure Storage Keys
  - Generic API keys and secrets
- **Visual Indicators**: Highlights detected leaks with color-coded severity badges
- **Severity Levels**: Categorizes leaks as Critical, High, Medium, or Low
- **Data Masking**: Automatically masks sensitive data in reports
- **Real-time Badge Updates**: Shows leak count in extension badge

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone or navigate to the extension directory**:
   ```bash
   cd extension
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the extension**:
   ```bash
   npm run build
   ```

   This will create a `dist` folder with the compiled extension.

4. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `dist` folder from the extension directory

## 🛠️ Development

### Build Commands

- **Production build**:
  ```bash
  npm run build
  ```

- **Development build with watch mode**:
  ```bash
  npm run dev
  ```

- **Clean build artifacts**:
  ```bash
  npm run clean
  ```

### Project Structure

```
extension/
├── src/
│   ├── background/
│   │   └── background.ts       # Service worker
│   ├── content/
│   │   └── content.ts          # Content script for scanning
│   ├── detectors/
│   │   ├── patterns.ts         # Detection patterns
│   │   └── scanner.ts          # Scanner logic
│   ├── popup/
│   │   ├── popup.html          # Popup UI
│   │   ├── popup.ts            # Popup logic
│   │   └── popup.css           # Popup styling
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── manifest.json           # Extension manifest
├── dist/                       # Build output (generated)
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

## 📖 Usage

1. **Navigate to any webpage** with code (e.g., GitHub, Stack Overflow, code sharing sites)

2. **The extension automatically scans** code blocks on the page

3. **View detections**:
   - Check the extension badge for leak count
   - Click the extension icon to see detailed results
   - Hover over highlighted code blocks for quick info

4. **Popup displays**:
   - Statistics by severity level
   - List of all detected leaks
   - Line numbers and context
   - Masked sensitive data

## 🎨 Detection Patterns

The extension uses regex patterns to detect various types of sensitive data:

### Critical Severity
- AWS Access Keys & Secrets
- Private Keys (RSA, SSH, PGP)
- Database Connection Strings
- GitHub Tokens
- Stripe Live API Keys

### High Severity
- Google API Keys
- Slack Tokens
- Generic API Keys
- Twilio API Keys
- SendGrid API Keys

### Medium Severity
- JWT Tokens
- Stripe Publishable Keys

### Low Severity
- Other potential sensitive patterns

## 🔧 Configuration

The detection patterns can be customized in `src/detectors/patterns.ts`. Each pattern includes:
- `name`: Pattern identifier
- `pattern`: Regex pattern for detection
- `severity`: Risk level (critical, high, medium, low)
- `description`: Human-readable description

## 🧪 Testing

To test the extension:

1. Create a test HTML file with sample code containing fake API keys
2. Load the page in Chrome
3. Open the extension popup to verify detections
4. Check the browser console for scan logs

Example test code:
```javascript
const AWS_KEY = "AKIAIOSFODNN7EXAMPLE";
const GITHUB_TOKEN = "ghp_1234567890abcdefghijklmnopqrstuv";
```

## 🛡️ Security & Privacy

- **No data transmission**: All scanning happens locally in your browser
- **Data masking**: Sensitive data is automatically masked in reports
- **No storage**: Scan results are stored only in local Chrome storage
- **Open source**: All code is transparent and auditable

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! To add new detection patterns:

1. Add the pattern to `src/detectors/patterns.ts`
2. Test thoroughly with sample data
3. Rebuild the extension
4. Submit a pull request

## 🐛 Known Limitations

- Only scans visible code blocks on the page
- May produce false positives for similar-looking strings
- Requires page reload for dynamic content in some cases

## 📞 Support

For issues or questions, please open an issue on the project repository.
