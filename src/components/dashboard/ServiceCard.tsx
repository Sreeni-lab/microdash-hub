import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye, Shield, AlertTriangle } from "lucide-react";

interface ContainerImage {
  name: string;
  size: string;
  efficiency: string;
}

interface SecurityScan {
  scanner: string;
  totalVulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  riskScore: string;
  scanStatus: 'completed' | 'failed' | 'running';
  lastScan: string;
  reportUrl?: string;
}

interface ServiceCardProps {
  name: string;
  status: 'healthy' | 'failed' | 'unreachable';
  version: string;
  serviceUrl?: string;
  credentialsUrl?: string;
  username?: string;
  password?: string;
  containerImages: ContainerImage[];
  securityScans: SecurityScan[];
  onViewScanDetails?: (scan: SecurityScan) => void;
}

export function ServiceCard({
  name,
  status,
  version,
  serviceUrl,
  credentialsUrl,
  username,
  password,
  containerImages,
  securityScans,
  onViewScanDetails
}: ServiceCardProps) {
  const [showCreds, setShowCreds] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-status-healthy text-background';
      case 'failed':
        return 'bg-status-failed text-background';
      case 'unreachable':
        return 'bg-status-unreachable text-background';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getScanStatusColor = (status: string) => {
    switch (status) {
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

  const getRiskColor = (risk: string) => {
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

  // Track expanded state for each image; first image open by default for multi-image cards
  const [expandedImages, setExpandedImages] = useState<{ [key: number]: boolean }>(() => {
    if (containerImages.length > 1) {
      // First image expanded, others collapsed
      return Object.fromEntries(containerImages.map((_, idx) => [idx, idx === 0]));
    }
    return {};
  });

  const handleExpandImage = (index: number) => {
    setExpandedImages(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Helper to get scans for a given image (match by reportUrl or add imageName to scan if needed)
  const getScansForImage = (image: ContainerImage) => {
    const baseName = image.name.split(':')[0].toLowerCase();
    // If only one image, show all scans (for legacy data without reportUrl)
    if (containerImages.length === 1) {
      return securityScans;
    }
    // Otherwise, match by reportUrl
    return securityScans.filter(scan => {
      if (!scan.reportUrl) return false;
      const urlParts = scan.reportUrl.split('/');
      const reportImage = urlParts[urlParts.length - 1].toLowerCase();
      return reportImage === baseName;
    });
  };

  return (
    <Card id={`service-card-${name.replace(/\s+/g, '-')}`} className="bg-gradient-card shadow-card border-border/50 hover:shadow-elevated transition-all duration-300 relative">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(status)} variant="secondary">
              {status === 'unreachable' ? 'Unreachable' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="text-accent font-medium">{version}</span>
          <div className="flex gap-2">
            {serviceUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={serviceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open Service
                </a>
              </Button>
            )}
            {username && password && (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowCreds((v) => !v)}>
                  <Eye className="w-3 h-3 mr-1" />
                  {showCreds ? "Hide Creds." : "Show Creds"}
                </Button>
                {showCreds && (
                  <div
                    className="absolute top-4 right-4 z-30 min-w-[220px] max-w-xs bg-gradient-card border border-border rounded-lg shadow-xl p-4"
                    style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)', borderColor: '#38bdf8' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-base">Credentials</div>
                      <Button variant="ghost" size="sm" className="p-1" onClick={() => setShowCreds(false)} aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                      </Button>
                    </div>
                    <div className="flex font-semibold border-b pb-1 mb-1">
                      <div className="w-1/2">Username</div>
                      <div className="w-1/2">Password</div>
                    </div>
                    <div className="flex mb-1">
                      <div className="w-1/2 font-mono">{username ?? 'NA'}</div>
                      <div className="w-1/2 font-mono">{password ?? 'NA'}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">• {username ? name + ' user' : 'NA'}</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Container Images with expandable scans */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Container Images ({containerImages.length})</h4>
          <div className="space-y-2">
            {/* Only render expanded image tiles, except the first which is always shown */}
            {containerImages.map((image, index) => (
              (index === 0 || expandedImages[index]) && (
                <div key={index} className="bg-background/50 rounded border p-2 mb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{image.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Efficiency: {image.efficiency} • Size: {image.size}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 space-y-3">
                    {getScansForImage(image).map((scan, scanIdx) => (
                      <div
                        key={scanIdx}
                        className="p-3 bg-background/30 rounded border cursor-pointer transition-all duration-200 hover:bg-accent/20 hover:border-accent"
                        onClick={() => onViewScanDetails?.(scan)}
                      >
                        {/* ...existing scan card code... */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-accent" />
                            <span className="font-medium text-sm">{scan.scanner}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getScanStatusColor(scan.scanStatus)} variant="secondary">
                              {scan.scanStatus}
                            </Badge>
                            {scan.totalVulnerabilities > 0 && (
                              <Badge variant="outline" className="border-status-warning/30">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {scan.critical + scan.high} Critical/High
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-2">
                          <div className="text-center">
                            <div className="text-lg font-bold text-severity-critical">{scan.critical}</div>
                            <div className="text-xs text-muted-foreground">Critical</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-severity-high">{scan.high}</div>
                            <div className="text-xs text-muted-foreground">High</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-severity-medium">{scan.medium}</div>
                            <div className="text-xs text-muted-foreground">Medium</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-severity-low">{scan.low}</div>
                            <div className="text-xs text-muted-foreground">Low</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="space-y-1">
                            <div>
                              <span className="text-muted-foreground">Risk Score: </span>
                              <span className={`font-medium ${getRiskColor(scan.riskScore)}`}>
                                {scan.riskScore}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Total: {scan.totalVulnerabilities} • Last Scan: {scan.lastScan}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
          {/* Show '+N more scan(s)' link below first image if there are more than 1 image and at least one is collapsed */}
          {containerImages.length > 1 && (
            <div className="text-center my-2">
              {Object.values(expandedImages).filter((v, idx) => idx !== 0 && !v).length > 0 ? (
                <button
                  className="text-sky-400 text-sm hover:underline"
                  type="button"
                  onClick={() => {
                    setExpandedImages(prev => {
                      const updated = { ...prev };
                      containerImages.forEach((_, idx) => {
                        if (idx !== 0) updated[idx] = true;
                      });
                      return updated;
                    });
                  }}
                >
                  {`+${containerImages.length - 1} more scan${containerImages.length - 1 > 1 ? 's' : ''}`}
                </button>
              ) : (
                <button
                  className="text-sky-400 text-sm hover:underline"
                  type="button"
                  onClick={() => {
                    setExpandedImages(prev => {
                      const updated = { ...prev };
                      containerImages.forEach((_, idx) => {
                        if (idx !== 0) updated[idx] = false;
                      });
                      return updated;
                    });
                  }}
                >
                  {`Show less`}
                </button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}