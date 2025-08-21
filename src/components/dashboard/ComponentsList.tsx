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
      <DialogContent className="max-w-md bg-gradient-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">
              {title} Components
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <span>{components.length} component{components.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {components.map((component, index) => (
              <div key={index} className="p-3 bg-background/30 rounded border">
                <div className="font-medium">{component}</div>
              </div>
            ))}
          </div>

          {components.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No components found
            </div>
          )}

          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}