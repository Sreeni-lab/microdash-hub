import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, FileText, AlertTriangle, ExternalLink, X } from "lucide-react";

interface SecurityScan {
  scanner: string;
  totalVulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  riskScore: string;
  scanStatus: string;
  lastScan: string;
  scanDuration?: string;
  reportUrl?: string;
  link?: string;
}

interface SecurityScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  scan: SecurityScan | null;
  serviceName?: string;
  containerName?: string;
  reportUrl?: string;
}

export function SecurityScanModal({
  isOpen,
  onClose,
  scan,
  serviceName = "Admin Console",
  containerName = "nginx:1.21-alpine",
  reportUrl
}: SecurityScanModalProps) {
  if (!scan) return null;
  // Defensive defaults for scan fields
  const {
    scanner = '',
    totalVulnerabilities = 0,
    critical = 0,
    high = 0,
    medium = 0,
    low = 0,
    riskScore = '',
    scanStatus = '',
    lastScan = '',
    scanDuration = '',
    reportUrl: scanReportUrl = ''
  } = scan || {};
  const getScanStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-muted text-muted-foreground';
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-status-healthy text-background';
      case 'failed':
        return 'bg-status-failed text-background';
      case 'running':
        return 'bg-status-warning text-background';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (risk: string | undefined) => {
    if (!risk) return 'text-muted-foreground';
    switch (risk.toLowerCase()) {
      case 'high risk':
        return 'text-status-failed';
      case 'medium risk':
        return 'text-status-warning';
      case 'low risk':
        return 'text-status-healthy';
      default:
        return 'text-muted-foreground';
    }
  };

  const actionItems = [
    "Review and patch critical vulnerabilities immediately",
    "Update base image to latest secure version",
    "Consider implementing additional security controls"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <DialogTitle className="text-xl">
              {scanner} Security Scan
            </DialogTitle>
          </div>
          <div className="text-sm text-muted-foreground">
            {serviceName} • {containerName}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Vulnerability Summary */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-background/30 rounded-lg border">
              <div className="text-2xl font-bold text-severity-critical">{critical}</div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="text-center p-4 bg-background/30 rounded-lg border">
              <div className="text-2xl font-bold text-severity-high">{high}</div>
              <div className="text-sm text-muted-foreground">High</div>
            </div>
            <div className="text-center p-4 bg-background/30 rounded-lg border">
              <div className="text-2xl font-bold text-severity-medium">{medium}</div>
              <div className="text-sm text-muted-foreground">Medium</div>
            </div>
            <div className="text-center p-4 bg-background/30 rounded-lg border">
              <div className="text-2xl font-bold text-severity-low">{low}</div>
              <div className="text-sm text-muted-foreground">Low</div>
            </div>
          </div>

          {/* Scan Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Scan Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Vulnerabilities:</span>
                  <span className="font-medium">{totalVulnerabilities}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Scan:</span>
                  <span className="font-medium">{lastScan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Report Generated:</span>
                  {scan.link ? (
                    <a href={scan.link} target="_blank" rel="noopener noreferrer" className="font-medium flex items-center gap-1 text-primary underline">
                      <FileText className="w-3 h-3" />
                      View Report
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="font-medium flex items-center gap-1 text-muted-foreground">
                      <FileText className="w-3 h-3" />
                      No Report
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Risk Assessment</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Risk Score:</span>
                  <span className={`font-bold text-lg ${getRiskColor(scan.riskScore)}`}>
                    {scan.riskScore}
                  </span>
                </div>
                <div className="p-3 bg-background/20 rounded border border-status-warning/30">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-status-warning mt-0.5 shrink-0" />
                    <span className="font-medium text-status-warning">
                      {scan.critical + scan.high} Critical/High Issues
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Immediate Action Required */}
          <div className="p-4 bg-status-warning/10 border border-status-warning/30 rounded-lg">
            <h3 className="font-semibold text-status-warning mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Immediate Action Required
            </h3>
            <ul className="space-y-2">
              {actionItems.map((item, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-status-warning">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}