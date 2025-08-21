import { useState, useMemo } from "react";
import { SummaryTiles } from "@/components/dashboard/SummaryTiles";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { ServiceCard } from "@/components/dashboard/ServiceCard";
import { SecurityScanModal } from "@/components/dashboard/SecurityScanModal";
import { ComponentsList } from "@/components/dashboard/ComponentsList";
import { ConfigurationModal } from "@/components/dashboard/ConfigurationModal";
import { useServices } from "@/contexts/ServicesContext";
import { Search, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  mockSummaryData, 
  mockHealthData, 
  mockSanityData, 
  mockVulnerabilityData 
} from "@/data/mockData";

const Index = () => {
  const { services, updateServices } = useServices();
  const [selectedScan, setSelectedScan] = useState<any>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showComponentsList, setShowComponentsList] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [componentsListData, setComponentsListData] = useState<{
    title: string;
    components: string[];
    status: any;
  }>({ title: "", components: [], status: "healthy" });
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewScanDetails = (scan: any) => {
    setSelectedScan(scan);
    setShowScanModal(true);
  };

  const handlePieClick = (data: any) => {
    if (data && data.components) {
      setComponentsListData({
        title: data.name,
        components: data.components,
        status: data.name.toLowerCase().includes('pass') ? 'passed' : 
               data.name.toLowerCase().includes('fail') ? 'failed' :
               data.name.toLowerCase().includes('unreachable') ? 'unreachable' : 'healthy'
      });
      setShowComponentsList(true);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate dynamic dashboard data based on current services
  const dashboardData = useMemo(() => {
    const healthyServices = services.filter(s => s.status === "healthy");
    const failedServices = services.filter(s => s.status === "failed");
    const unreachableServices = services.filter(s => s.status === "unreachable");
    
    const summaryData = {
      healthy: healthyServices.length,
      failed: failedServices.length,
      unreachable: unreachableServices.length,
      sanityPassed: healthyServices.length + Math.floor(failedServices.length / 2),
      twistlockCriticalHigh: services.reduce((sum, s) => {
        const twistlock = s.securityScans.find(scan => scan.scanner === "Twistlock");
        return sum + (twistlock ? twistlock.critical + twistlock.high : 0);
      }, 0),
      sysdigCriticalHigh: services.reduce((sum, s) => {
        const sysdig = s.securityScans.find(scan => scan.scanner === "Sysdig");
        return sum + (sysdig ? sysdig.critical + sysdig.high : 0);
      }, 0),
      uptime: services.length > 0 ? `${Math.round((healthyServices.length / services.length) * 100)}%` : "0%"
    };

    const healthData = [
      {
        name: "Healthy",
        value: healthyServices.length,
        color: "hsl(var(--status-healthy))",
        components: healthyServices.map(s => s.name)
      },
      {
        name: "Failed",
        value: failedServices.length,
        color: "hsl(var(--status-failed))",
        components: failedServices.map(s => s.name)
      },
      {
        name: "Unreachable",
        value: unreachableServices.length,
        color: "hsl(var(--status-unreachable))",
        components: unreachableServices.map(s => s.name)
      }
    ];

    const vulnerabilityData = services.map(service => {
      const twistlock = service.securityScans.find(scan => scan.scanner === "Twistlock");
      const sysdig = service.securityScans.find(scan => scan.scanner === "Sysdig");
      
      return {
        component: service.name,
        critical: (twistlock?.critical || 0) + (sysdig?.critical || 0),
        high: (twistlock?.high || 0) + (sysdig?.high || 0),
        medium: (twistlock?.medium || 0) + (sysdig?.medium || 0),
        low: (twistlock?.low || 0) + (sysdig?.low || 0)
      };
    });

    return { summaryData, healthData, vulnerabilityData };
  }, [services]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Documentum Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Application health, security monitoring & sanity testing
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search components..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowConfigModal(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Summary Tiles */}
        <SummaryTiles data={dashboardData.summaryData} />

        {/* Charts Section */}
        <ChartsSection
          healthData={dashboardData.healthData}
          sanityData={mockSanityData}
          vulnerabilityData={dashboardData.vulnerabilityData}
          onPieClick={handlePieClick}
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <ServiceCard
              key={index}
              name={service.name}
              status={service.status}
              version={service.version}
              serviceUrl={service.serviceUrl}
              credentialsUrl={service.credentialsUrl}
              containerImages={service.containerImages}
              securityScans={service.securityScans}
              onViewScanDetails={handleViewScanDetails}
            />
          ))}
        </div>

        {filteredServices.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services found matching "{searchQuery}"</p>
          </div>
        )}
      </main>

      {/* Modals */}
      <SecurityScanModal
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        scan={selectedScan}
      />

      <ComponentsList
        isOpen={showComponentsList}
        onClose={() => setShowComponentsList(false)}
        title={componentsListData.title}
        components={componentsListData.components}
        status={componentsListData.status}
      />

      <ConfigurationModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        services={services}
        onServicesUpdate={updateServices}
      />
    </div>
  );
};

export default Index;
