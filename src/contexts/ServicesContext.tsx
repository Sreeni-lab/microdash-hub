import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Service {
  id: string;
  name: string;
  status: "healthy" | "failed" | "unreachable";
  version: string;
  serviceUrl: string;
  credentialsUrl: string;
  username?: string;
  password?: string;
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
    name: "Sample App",
    status: "healthy",
    version: "v1.0.0",
    serviceUrl: "https://sampleapp.example.com",
    credentialsUrl: "https://creds.example.com/sampleapp",
    username: "sampleuser",
    password: "samplepass123",
    containerImages: [
      {
        name: "nginx:1.21-alpine",
        size: "420MB",
        efficiency: "74%"
      },
      {
        name: "redis:7.0-alpine",
        size: "120MB",
        efficiency: "88%"
      }
    ],
    securityScans: [
      {
        scanner: "Twistlock",
        totalVulnerabilities: 45,
        critical: 12,
        high: 8,
        medium: 15,
        low: 10,
        riskScore: "High Risk",
        scanStatus: "completed",
        lastScan: "2024-08-01",
        scanDuration: "1m 20s",
        reportUrl: "https://twistlock.example.com/reports/nginx"
      },
      {
        scanner: "Sysdig",
        totalVulnerabilities: 30,
        critical: 5,
        high: 7,
        medium: 10,
        low: 8,
        riskScore: "Medium Risk",
        scanStatus: "completed",
        lastScan: "2024-08-01",
        scanDuration: "1m 10s",
        reportUrl: "https://sysdig.example.com/reports/nginx"
      },
      {
        scanner: "Twistlock",
        totalVulnerabilities: 20,
        critical: 3,
        high: 2,
        medium: 10,
        low: 5,
        riskScore: "Low Risk",
        scanStatus: "completed",
        lastScan: "2024-08-01",
        scanDuration: "0m 50s",
        reportUrl: "https://twistlock.example.com/reports/redis"
      },
      {
        scanner: "Sysdig",
        totalVulnerabilities: 15,
        critical: 1,
        high: 2,
        medium: 7,
        low: 5,
        riskScore: "Low Risk",
        scanStatus: "completed",
        lastScan: "2024-08-01",
        scanDuration: "0m 40s",
        reportUrl: "https://sysdig.example.com/reports/redis"
      }
    ]
  },
  {
    id: "2",
    name: "AWG",
    status: "healthy",
    version: "v25.4.0",
    serviceUrl: "https://google.com",
    credentialsUrl: "https://creds.example.com/awg",
    username: "awguser",
    password: "awgpass5678",
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
    username: "bpsuser",
    password: "bpspass9012",
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

  // Check each service's URL and update status accordingly
  useEffect(() => {
    const checkServicesHealth = async () => {
      const updated = await Promise.all(services.map(async (service) => {
        try {
          const res = await fetch(`http://localhost:3001/api/health-check?url=${encodeURIComponent(service.serviceUrl)}`);
          const data = await res.json();
          if (data.status === 200) {
            return { ...service, status: 'healthy' as 'healthy' };
          } else {
            return { ...service, status: 'unreachable' as 'unreachable' };
          }
        } catch {
          return { ...service, status: 'unreachable' as 'unreachable' };
        }
      }));
      setServices(updated);
      localStorage.setItem('dashboard-services', JSON.stringify(updated));
    };
    checkServicesHealth();
  }, []);

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