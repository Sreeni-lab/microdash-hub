import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@/contexts/ServicesContext";

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onServicesUpdate: (services: Service[]) => void;
}

export const ConfigurationModal = ({
  isOpen,
  onClose,
  services,
  onServicesUpdate,
}: ConfigurationModalProps) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "healthy" as "healthy" | "failed" | "unreachable",
    version: "",
    serviceUrl: "",
    credentialsUrl: "",
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: "",
      status: "healthy" as "healthy" | "failed" | "unreachable",
      version: "",
      serviceUrl: "",
      credentialsUrl: "",
    });
    setEditingService(null);
  };

  const handleAddService = () => {
    if (!formData.name || !formData.serviceUrl) {
      toast({
        title: "Validation Error",
        description: "Name and Service URL are required",
        variant: "destructive",
      });
      return;
    }

    const newService: Service = {
      id: Date.now().toString(),
      ...formData,
      containerImages: [
        {
          name: "nginx:latest",
          size: "400MB",
          efficiency: "75%",
        },
      ],
      securityScans: [
        {
          scanner: "Twistlock",
          totalVulnerabilities: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          riskScore: "Low Risk",
          scanStatus: "completed",
          lastScan: new Date().toISOString().split('T')[0],
        },
      ],
    };

    onServicesUpdate([...services, newService]);
    resetForm();
    toast({
      title: "Service Added",
      description: `${formData.name} has been added successfully`,
    });
  };

  const handleUpdateService = () => {
    if (!editingService || !formData.name || !formData.serviceUrl) {
      toast({
        title: "Validation Error",
        description: "Name and Service URL are required",
        variant: "destructive",
      });
      return;
    }

    const updatedServices = services.map((service) =>
      service.id === editingService.id
        ? { ...service, ...formData }
        : service
    );

    onServicesUpdate(updatedServices);
    resetForm();
    toast({
      title: "Service Updated",
      description: `${formData.name} has been updated successfully`,
    });
  };

  const handleDeleteService = (serviceId: string) => {
    const serviceName = services.find(s => s.id === serviceId)?.name;
    const updatedServices = services.filter((service) => service.id !== serviceId);
    onServicesUpdate(updatedServices);
    toast({
      title: "Service Deleted",
      description: `${serviceName} has been removed`,
    });
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      status: service.status,
      version: service.version,
      serviceUrl: service.serviceUrl,
      credentialsUrl: service.credentialsUrl,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Components Configuration</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add/Edit Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {editingService ? "Edit Component" : "Add New Component"}
            </h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Component Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Admin Console"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="unreachable">Unreachable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="e.g., v25.4.0"
                />
              </div>

              <div>
                <Label htmlFor="serviceUrl">Service URL</Label>
                <Input
                  id="serviceUrl"
                  value={formData.serviceUrl}
                  onChange={(e) => setFormData({ ...formData, serviceUrl: e.target.value })}
                  placeholder="https://service.example.com"
                />
              </div>

              <div>
                <Label htmlFor="credentialsUrl">Credentials URL</Label>
                <Input
                  id="credentialsUrl"
                  value={formData.credentialsUrl}
                  onChange={(e) => setFormData({ ...formData, credentialsUrl: e.target.value })}
                  placeholder="https://creds.example.com/service"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={editingService ? handleUpdateService : handleAddService}
                  className="flex-1"
                >
                  {editingService ? "Update Component" : "Add Component"}
                </Button>
                {editingService && (
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Components ({services.length})</h3>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg bg-card"
                >
                  <div className="flex-1">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {service.version} • {service.status}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditService(service)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};