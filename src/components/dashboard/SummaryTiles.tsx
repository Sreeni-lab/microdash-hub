import { Card } from "@/components/ui/card";
import { Shield, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

interface SummaryTile {
  label: string;
  value: string | number;
  status: 'healthy' | 'failed' | 'unreachable' | 'warning' | 'info';
  icon: React.ReactNode;
}

interface SummaryTilesProps {
  data: {
    healthy: number;
    failed: number;
    unreachable: number;
    sanityPassed: number;
    sanityFailed: number;
    twistlockCriticalHigh: number;
    sysdigCriticalHigh: number;
  };
}

export function SummaryTiles({ data }: SummaryTilesProps) {
  const tiles: SummaryTile[] = [
    {
      label: "Healthy",
      value: data.healthy,
      status: "healthy",
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      label: "Failed",
      value: data.failed,
      status: "failed",
      icon: <XCircle className="w-5 h-5" />
    },
    {
      label: "Unreachable",
      value: data.unreachable,
      status: "unreachable",
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      label: "Sanity Passed",
      value: data.sanityPassed,
      status: "healthy",
      icon: <Shield className="w-5 h-5" />
    },
    {
      label: "Failed Sanity Tests",
      value: data.sanityFailed,
      status: "failed",
      icon: <XCircle className="w-5 h-5" />
    },
    {
      label: "Twistlock C+H",
      value: data.twistlockCriticalHigh,
      status: "warning",
      icon: <Shield className="w-5 h-5" />
    },
    {
      label: "Sysdig C+H",
      value: data.sysdigCriticalHigh,
      status: "info",
      icon: <Shield className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: SummaryTile['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-status-healthy border-status-healthy/20 bg-status-healthy/5';
      case 'failed':
        return 'text-status-failed border-status-failed/20 bg-status-failed/5';
      case 'unreachable':
        return 'text-status-unreachable border-status-unreachable/20 bg-status-unreachable/5';
      case 'warning':
        return 'text-status-warning border-status-warning/20 bg-status-warning/5';
      case 'info':
        return 'text-status-info border-status-info/20 bg-status-info/5';
      default:
        return 'text-muted-foreground border-border bg-card';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
      {tiles.map((tile, index) => (
        <Card
          key={index}
          className={`p-4 border transition-all duration-200 hover:shadow-elevated ${getStatusColor(tile.status)}`}
        >
          <div className="flex items-center gap-2 mb-2">
            {tile.icon}
            <span className="text-sm font-medium opacity-90">{tile.label}</span>
          </div>
          <div className="text-2xl font-bold">{tile.value}</div>
        </Card>
      ))}
    </div>
  );
}