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
}

interface ServiceCardProps {
  name: string;
  status: 'healthy' | 'failed' | 'unreachable';
  version: string;
  serviceUrl?: string;
  credentialsUrl?: string;
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
  containerImages,
  securityScans,
  onViewScanDetails
}: ServiceCardProps) {
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

  return (
    <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-elevated transition-all duration-300">
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
            {credentialsUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={credentialsUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="w-3 h-3 mr-1" />
                  Show Creds
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Container Images */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Container Images ({containerImages.length})</h4>
          <div className="space-y-2">
            {containerImages.map((image, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-background/50 rounded border">
                <div>
                  <div className="font-medium text-sm">{image.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Efficiency: {image.efficiency} • Size: {image.size}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Scans */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Security Scans</h4>
          <div className="space-y-3">
            {securityScans.map((scan, index) => (
              <div key={index} className="p-3 bg-background/30 rounded border">
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewScanDetails?.(scan)}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open Full Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}