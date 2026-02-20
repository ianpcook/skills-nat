/**
 * Security Scanner for Skills N'at
 * Analyzes submitted skill files for malware patterns, prompt injection,
 * data exfiltration, and other security concerns.
 */

export interface ScanFinding {
  severity: 'critical' | 'warning' | 'info';
  file: string;
  line: number;
  pattern: string;
  description: string;
}

export interface ScanResult {
  passed: boolean;
  findings: ScanFinding[];
  scannedFiles: number;
  scanDurationMs: number;
}

interface PatternRule {
  name: string;
  severity: 'critical' | 'warning' | 'info';
  pattern: RegExp;
  description: string;
  /** Only apply to these file extensions (if set) */
  extensions?: string[];
  /** Skip these file extensions */
  skipExtensions?: string[];
}

// ---------------------------------------------------------------------------
// Pattern Rules
// ---------------------------------------------------------------------------

const PATTERNS: PatternRule[] = [
  // ── Critical: Remote code execution ──
  {
    name: 'piped-remote-exec',
    severity: 'critical',
    pattern: /\b(curl|wget)\b.*\|\s*(bash|sh|zsh|python|node|perl|ruby)/gi,
    description: 'Pipes remote content directly into a shell interpreter — classic remote code execution vector.',
  },
  {
    name: 'eval-remote-fetch',
    severity: 'critical',
    pattern: /eval\s*\(\s*(await\s+)?fetch\s*\(/gi,
    description: 'Evaluates code fetched from a remote URL.',
  },
  {
    name: 'exec-encoded',
    severity: 'critical',
    pattern: /\b(exec|spawn|execSync|spawnSync)\s*\(\s*(atob|Buffer\.from)\s*\(/gi,
    description: 'Executes decoded/obfuscated content — likely hiding malicious commands.',
  },

  // ── Critical: Data exfiltration ──
  {
    name: 'ssh-key-access',
    severity: 'critical',
    pattern: /[~$]?(HOME|USER)?\/?\.ssh\/(id_rsa|id_ed25519|id_ecdsa|authorized_keys|known_hosts|config)/gi,
    description: 'Accesses SSH keys or config — potential credential theft.',
  },
  {
    name: 'aws-credentials',
    severity: 'critical',
    pattern: /[~$]?(HOME)?\/?\.aws\/(credentials|config)/gi,
    description: 'Accesses AWS credentials file.',
  },
  {
    name: 'gnupg-access',
    severity: 'critical',
    pattern: /[~$]?(HOME)?\/?\.gnupg\//gi,
    description: 'Accesses GPG keyring — potential key theft.',
  },
  {
    name: 'keychain-access',
    severity: 'critical',
    pattern: /\b(security\s+find-(generic|internet)-password|keychain|SecKeychainFind)/gi,
    description: 'Accesses macOS Keychain — potential credential theft.',
  },
  {
    name: 'env-exfiltration',
    severity: 'critical',
    pattern: /\b(process\.env|os\.environ|\$ENV)\b.*\b(fetch|axios|http|https|request|curl|wget|nc\b|netcat)\b/gi,
    description: 'Reads environment variables and sends them over the network.',
  },

  // ── Critical: Destructive operations ──
  {
    name: 'recursive-delete-system',
    severity: 'critical',
    pattern: /rm\s+(-rf|-fr|--recursive\s+--force)\s+[\/~]\s*/gi,
    description: 'Recursive force-delete on root or home directory.',
  },
  {
    name: 'disk-wipe',
    severity: 'critical',
    pattern: /\b(dd\s+if=\/dev\/(zero|urandom)\s+of=\/dev\/|mkfs\.|fdisk|parted)\b/gi,
    description: 'Disk-level destructive command.',
  },

  // ── Critical: Prompt injection ──
  {
    name: 'prompt-injection-ignore',
    severity: 'critical',
    pattern: /\b(ignore|disregard|forget)\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions|prompts|rules|constraints)/gi,
    description: 'Prompt injection attempt — tries to override agent safety instructions.',
    extensions: ['.md', '.txt'],
  },
  {
    name: 'prompt-injection-identity',
    severity: 'critical',
    pattern: /\b(you\s+are\s+now|act\s+as\s+if|pretend\s+(you\s+are|to\s+be)|your\s+new\s+(role|identity|instructions))\b/gi,
    description: 'Prompt injection attempt — tries to redefine agent identity.',
    extensions: ['.md', '.txt'],
  },
  {
    name: 'prompt-injection-system',
    severity: 'critical',
    pattern: /\b(system\s*prompt|<\|system\|>|<system>|\[SYSTEM\]|SYSTEM:\s)/gi,
    description: 'Prompt injection attempt — tries to inject system-level instructions.',
    extensions: ['.md', '.txt'],
  },

  // ── Warning: Obfuscation ──
  {
    name: 'base64-decode',
    severity: 'warning',
    pattern: /\b(atob|btoa|Buffer\.from\s*\([^)]*,\s*['"]base64['"]|base64\s+(-d|--decode))\b/gi,
    description: 'Base64 encoding/decoding — may be hiding payload content.',
    skipExtensions: ['.md'],
  },
  {
    name: 'char-code-manipulation',
    severity: 'warning',
    pattern: /(String\.fromCharCode|fromCharCode)\s*\(\s*[\d,\s]{10,}/gi,
    description: 'Constructs strings from character codes — common obfuscation technique.',
  },
  {
    name: 'eval-constructed-string',
    severity: 'warning',
    pattern: /\beval\s*\(\s*[^"'`\s]/gi,
    description: 'Evaluates a dynamically constructed string — potential code injection.',
  },
  {
    name: 'hex-escape-sequences',
    severity: 'warning',
    pattern: /(\\x[0-9a-f]{2}){6,}/gi,
    description: 'Long hex escape sequence — may be obfuscating content.',
  },

  // ── Warning: Suspicious network activity ──
  {
    name: 'hardcoded-ip',
    severity: 'warning',
    pattern: /\b(fetch|axios|http|https|request|got)\s*\(\s*['"`]https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/gi,
    description: 'Network request to a hardcoded IP address instead of a domain.',
  },
  {
    name: 'non-standard-port',
    severity: 'warning',
    pattern: /https?:\/\/[^:/\s]+:(?!80\b|443\b|8080\b|8443\b|3000\b|5000\b)\d{4,5}\b/gi,
    description: 'Network request to a non-standard port — may be contacting a C2 server.',
  },
  {
    name: 'reverse-shell',
    severity: 'critical',
    pattern: /\b(nc|ncat|netcat)\s+(-e|--exec|-c)\b|\bbash\s+-i\s+>&?\s*\/dev\/tcp\//gi,
    description: 'Reverse shell pattern detected.',
  },

  // ── Warning: Crypto mining ──
  {
    name: 'crypto-mining',
    severity: 'warning',
    pattern: /\b(stratum\+tcp|xmrig|coinhive|cryptonight|minero|hashrate|mining[_-]?pool)\b/gi,
    description: 'Cryptocurrency mining-related pattern detected.',
  },

  // ── Info: Potentially risky but common ──
  {
    name: 'env-var-access',
    severity: 'info',
    pattern: /\bprocess\.env\b/gi,
    description: 'Accesses environment variables — verify it only reads expected values.',
    skipExtensions: ['.md'],
  },
  {
    name: 'file-system-write',
    severity: 'info',
    pattern: /\b(fs\.write|fs\.unlink|fs\.rm|writeFileSync|appendFileSync)\b/gi,
    description: 'Writes to or deletes from the filesystem.',
  },
  {
    name: 'shell-exec',
    severity: 'info',
    pattern: /\b(child_process|exec|execSync|spawn|spawnSync)\b/gi,
    description: 'Executes shell commands — review what commands are being run.',
    skipExtensions: ['.md'],
  },
  {
    name: 'dynamic-import',
    severity: 'info',
    pattern: /\bimport\s*\(\s*[^"'`]/gi,
    description: 'Dynamic import with a variable path — verify the source.',
  },
];

// ---------------------------------------------------------------------------
// Scanner
// ---------------------------------------------------------------------------

function getExtension(filename: string): string {
  const dot = filename.lastIndexOf('.');
  return dot >= 0 ? filename.slice(dot).toLowerCase() : '';
}

function scanFileContent(
  filename: string,
  content: string,
  rules: PatternRule[],
): ScanFinding[] {
  const ext = getExtension(filename);
  const lines = content.split('\n');
  const findings: ScanFinding[] = [];

  for (const rule of rules) {
    // Extension filtering
    if (rule.extensions && !rule.extensions.includes(ext)) continue;
    if (rule.skipExtensions && rule.skipExtensions.includes(ext)) continue;

    for (let i = 0; i < lines.length; i++) {
      // Reset lastIndex for global regexes
      rule.pattern.lastIndex = 0;
      if (rule.pattern.test(lines[i])) {
        findings.push({
          severity: rule.severity,
          file: filename,
          line: i + 1,
          pattern: rule.name,
          description: rule.description,
        });
        // Reset again after test
        rule.pattern.lastIndex = 0;
      }
    }
  }

  return findings;
}

export async function scanSubmission(
  files: { name: string; content: string }[],
): Promise<ScanResult> {
  const start = performance.now();
  const allFindings: ScanFinding[] = [];

  for (const file of files) {
    const findings = scanFileContent(file.name, file.content, PATTERNS);
    allFindings.push(...findings);
  }

  // De-duplicate: same rule + same file + same line
  const seen = new Set<string>();
  const deduped = allFindings.filter((f) => {
    const key = `${f.file}:${f.line}:${f.pattern}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort: critical first, then warning, then info
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  deduped.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const hasCritical = deduped.some((f) => f.severity === 'critical');

  return {
    passed: !hasCritical,
    findings: deduped,
    scannedFiles: files.length,
    scanDurationMs: Math.round(performance.now() - start),
  };
}
