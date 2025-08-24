import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ComponentsListProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  components: string[];
  status: 'healthy' | 'failed' | 'unreachable' | 'passed';
}

export function ComponentsList({ isOpen, onClose, title, components, status }: ComponentsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'passed':
        return 'bg-status-healthy text-background';
      case 'failed':
        return 'bg-status-failed text-background';
      case 'unreachable':
        return 'bg-status-unreachable text-background';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-card border-border flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-lg">Components Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4 overflow-y-auto flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <span>{components.length} component{components.length !== 1 ? 's' : ''}</span>
          </div>
          {/* Table for name and status */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left font-semibold">Name</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {components.map((component, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="px-3 py-2 font-medium">{component}</td>
                    <td className="px-3 py-2">
                      <Badge className={getStatusColor(status)}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {components.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-3 py-2 text-muted-foreground text-center">No components found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Button variant="outline" onClick={onClose} className="w-full mt-4 sticky bottom-0 bg-gradient-card z-10">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}