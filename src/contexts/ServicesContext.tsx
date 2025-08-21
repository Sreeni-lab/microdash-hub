import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Service {
  id: string;
  name: string;
  status: "healthy" | "failed" | "unreachable";
  version: string;
  serviceUrl: string;
  credentialsUrl: string;
  containerImages: Array<{
    name: string;
    size: string;
    efficiency: string;
  }>;
  securityScans: Array<{
    scanner: string;
    totalVulnerabilities: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    riskScore: string;
    scanStatus: "completed" | "running" | "failed";
    lastScan: string;
    scanDuration?: string;
    reportUrl?: string;
  }>;
}

interface ServicesContextType {
  services: Service[];
  updateServices: (services: Service[]) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  removeService: (id: string) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

// Default services data
const defaultServices: Service[] = [
  {
    id: "1",
    name: "Admin Console",
    status: "healthy",
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
        scanStatus: "completed",
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
        scanStatus: "completed",
        lastScan: "2024-01-15",
        scanDuration: "1m 45s",
        reportUrl: "https://sysdig.example.com/reports/admin-console"
      }
    ]
  },
  {
    id: "2",
    name: "AWG",
    status: "healthy",
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
        scanStatus: "completed",
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
        scanStatus: "completed",
        lastScan: "2024-01-15"
      }
    ]
  },
  {
    id: "3",
    name: "BPS",
    status: "healthy",
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
        scanStatus: "completed",
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
        scanStatus: "completed",
        lastScan: "2024-01-15"
      }
    ]
  }
];

export const ServicesProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('dashboard-services');
    return saved ? JSON.parse(saved) : defaultServices;
  });

  useEffect(() => {
    localStorage.setItem('dashboard-services', JSON.stringify(services));
  }, [services]);

  const updateServices = (newServices: Service[]) => {
    setServices(newServices);
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
    };
    setServices(prev => [...prev, newService]);
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, ...updates } : service
    ));
  };

  return (
    <ServicesContext.Provider value={{
      services,
      updateServices,
      addService,
      removeService,
      updateService,
    }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};