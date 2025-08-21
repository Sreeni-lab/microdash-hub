export const mockSummaryData = {
  healthy: 3,
  failed: 0,
  unreachable: 19,
  sanityPassed: 17,
  twistlockCriticalHigh: 919,
  sysdigCriticalHigh: 771,
  uptime: "13%"
};

export const mockHealthData = [
  {
    name: "Healthy",
    value: 3,
    color: "hsl(var(--status-healthy))",
    components: ["Admin Console", "AWG", "BPS"]
  },
  {
    name: "Failed",
    value: 0,
    color: "hsl(var(--status-failed))",
    components: []
  },
  {
    name: "Unreachable",
    value: 19,
    color: "hsl(var(--status-unreachable))",
    components: [
      "CMIS", "Content Connect", "DCC", "Document Broker", "Email Service",
      "Event Publisher", "File Store", "Index Server", "LDAP Service",
      "Media Server", "Notification Service", "Process Engine", "Reporting",
      "Search Service", "Task Service", "Thumbnail Server", "Version Store",
      "Web Publisher", "Workflow Engine"
    ]
  }
];

export const mockSanityData = [
  {
    name: "Passed",
    value: 17,
    color: "hsl(var(--status-healthy))",
    components: [
      "Admin Console", "AWG", "BPS", "Document Broker", "Email Service",
      "Event Publisher", "File Store", "Index Server", "LDAP Service",
      "Media Server", "Notification Service", "Process Engine", "Reporting",
      "Search Service", "Task Service", "Thumbnail Server", "Version Store"
    ]
  },
  {
    name: "Failed",
    value: 5,
    color: "hsl(var(--status-failed))",
    components: ["CMIS", "Content Connect", "DCC", "Web Publisher", "Workflow Engine"]
  }
];

export const mockVulnerabilityData = [
  {
    component: "Admin Console",
    critical: 29,
    high: 13,
    medium: 30,
    low: 27
  },
  {
    component: "AWG",
    critical: 5,
    high: 7,
    medium: 29,
    low: 23
  },
  {
    component: "BPS",
    critical: 12,
    high: 6,
    medium: 13,
    low: 5
  },
  {
    component: "CMIS",
    critical: 8,
    high: 4,
    medium: 15,
    low: 12
  },
  {
    component: "Content Connect",
    critical: 20,
    high: 7,
    medium: 27,
    low: 14
  },
  {
    component: "DCC",
    critical: 10,
    high: 15,
    medium: 8,
    low: 20
  }
];

export const mockServices = [
  {
    name: "Admin Console",
    status: "healthy" as const,
    version: "v25.4.0",
    serviceUrl: "https://admin.example.com",
    credentialsUrl: "https://creds.example.com/admin",
    containerImages: [
      {
        name: "nginx:1.21-alpine",
        size: "420MB",
        efficiency: "74%"
      }
    ],
    securityScans: [
      {
        scanner: "Twistlock",
        totalVulnerabilities: 99,
        critical: 29,
        high: 13,
        medium: 30,
        low: 27,
        riskScore: "High Risk",
        scanStatus: "completed" as const,
        lastScan: "2024-01-15",
        scanDuration: "2m 34s",
        reportUrl: "https://twistlock.example.com/reports/admin-console"
      },
      {
        scanner: "Sysdig",
        totalVulnerabilities: 53,
        critical: 10,
        high: 15,
        medium: 8,
        low: 20,
        riskScore: "Medium Risk",
        scanStatus: "completed" as const,
        lastScan: "2024-01-15",
        scanDuration: "1m 45s",
        reportUrl: "https://sysdig.example.com/reports/admin-console"
      }
    ]
  },
  {
    name: "AWG",
    status: "healthy" as const,
    version: "v25.4.0",
    serviceUrl: "https://awg.example.com",
    credentialsUrl: "https://creds.example.com/awg",
    containerImages: [
      {
        name: "nginx:1.21",
        size: "450MB",
        efficiency: "72%"
      }
    ],
    securityScans: [
      {
        scanner: "Twistlock",
        totalVulnerabilities: 64,
        critical: 5,
        high: 7,
        medium: 29,
        low: 23,
        riskScore: "Medium Risk",
        scanStatus: "completed" as const,
        lastScan: "2024-01-15"
      },
      {
        scanner: "Sysdig",
        totalVulnerabilities: 68,
        critical: 20,
        high: 7,
        medium: 27,
        low: 14,
        riskScore: "High Risk",
        scanStatus: "completed" as const,
        lastScan: "2024-01-15"
      }
    ]
  },
  {
    name: "BPS",
    status: "healthy" as const,
    version: "v25.4.0",
    serviceUrl: "https://bps.example.com",
    credentialsUrl: "https://creds.example.com/bps",
    containerImages: [
      {
        name: "openjdk:11-jre-slim",
        size: "520MB",
        efficiency: "73%"
      }
    ],
    securityScans: [
      {
        scanner: "Twistlock",
        totalVulnerabilities: 36,
        critical: 12,
        high: 6,
        medium: 13,
        low: 5,
        riskScore: "High Risk",
        scanStatus: "completed" as const,
        lastScan: "2024-01-15"
      },
      {
        scanner: "Sysdig",
        totalVulnerabilities: 53,
        critical: 10,
        high: 15,
        medium: 8,
        low: 20,
        riskScore: "Medium Risk",
        scanStatus: "completed" as const,
        lastScan: "2024-01-15"
      }
    ]
  }
];