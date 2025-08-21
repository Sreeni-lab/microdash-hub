import { useState } from "react";
import { SummaryTiles } from "@/components/dashboard/SummaryTiles";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { ServiceCard } from "@/components/dashboard/ServiceCard";
import { SecurityScanModal } from "@/components/dashboard/SecurityScanModal";
import { ComponentsList } from "@/components/dashboard/ComponentsList";
import { Search, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  mockSummaryData, 
  mockHealthData, 
  mockSanityData, 
  mockVulnerabilityData, 
  mockServices 
} from "@/data/mockData";

const Index = () => {
  const [selectedScan, setSelectedScan] = useState<any>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showComponentsList, setShowComponentsList] = useState(false);
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

  const filteredServices = mockServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Summary Tiles */}
        <SummaryTiles data={mockSummaryData} />

        {/* Charts Section */}
        <ChartsSection
          healthData={mockHealthData}
          sanityData={mockSanityData}
          vulnerabilityData={mockVulnerabilityData}
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
    </div>
  );
};

export default Index;
