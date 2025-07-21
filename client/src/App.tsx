import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Founders from "@/pages/about/Founders";
import Company from "@/pages/about/Company";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/services/ServiceDetail";
import Contact from "@/pages/Contact";
import Policy from "@/pages/Policy";
import Register from "@/pages/Register";
import Login from '@/pages/Login';

// Client pages
import ClientDashboard from "@/pages/client/Dashboard";
import ClientProfile from "@/pages/client/Profile";
import ClientContracts from "@/pages/client/Contracts";
import ClientContractView from "@/pages/client/ContractView";

// Employee pages
import EmployeeDashboard from "@/pages/employee/Dashboard";
import EmployeeProfile from "@/pages/employee/Profile";
import EmployeeContracts from "@/pages/employee/Contracts";
import EmployeeContractSpecific from "@/pages/employee/ContractSpecific";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProfile from "@/pages/admin/Profile";
import AdminContracts from "@/pages/admin/Contracts";
import AdminContractSpecific from "@/pages/admin/ContractSpecific";
import AdminNewContract from "@/pages/admin/NewContract";
import AdminUserManagement from "@/pages/admin/UserManagement";
import { NavigationBar } from './components/NavigationBar';
import { Footer } from './components/Footer';
import { ThemeProvider } from "@/hooks/useTheme";
import PublicLayout from "./components/PublicLayout";
import ProtectedLayout from "./components/ProtectedLayout";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminDashboardDemo from "@/pages/demo/AdminDashboardDemo";
import AdminContractsDemo from "@/pages/demo/AdminContractsDemo";
import AdminContractSpecificDemo from "@/pages/demo/AdminContractSpecificDemo";
import AdminNewContractDemo from "@/pages/demo/AdminNewContractDemo";
import AdminProfileDemo from "@/pages/demo/AdminProfileDemo";
import AdminUserManagementDemo from "@/pages/demo/AdminUserManagementDemo";

import ClientDashboardDemo from "@/pages/demo/ClientDashboardDemo";
import ClientContractsDemo from "@/pages/demo/ClientContractsDemo";
import ClientContractViewDemo from "@/pages/demo/ClientContractViewDemo";
import ClientProfileDemo from "@/pages/demo/ClientProfileDemo";

import EmployeeDashboardDemo from "@/pages/demo/EmployeeDashboardDemo";
import EmployeeContractsDemo from "@/pages/demo/EmployeeContractsDemo";
import EmployeeContractSpecificDemo from "@/pages/demo/EmployeeContractSpecificDemo";
import EmployeeProfileDemo from "@/pages/demo/EmployeeProfileDemo";
import AdminDemoLayout from "@/pages/demo/AdminDemoLayout";
import ClientDemoLayout from "@/pages/demo/ClientDemoLayout";
import EmployeeDemoLayout from "@/pages/demo/EmployeeDemoLayout";

function Router() {
  const { isAuthenticated, isLoading, user, error } = useAuth();

  useEffect(() => {
    if (
      error?.message?.includes("401") &&
      !window.location.pathname.startsWith("/login") &&
      !window.location.pathname.startsWith("/register")
    ) {
      window.location.href = "/login";
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Demo-only: Direct dashboard routes for mock data, not protected */}
      <Route path="/demo/admin/dashboard">
        <AdminDemoLayout><AdminDashboardDemo /></AdminDemoLayout>
      </Route>
      <Route path="/demo/admin/contracts">
        <AdminDemoLayout><AdminContractsDemo /></AdminDemoLayout>
      </Route>
      <Route path="/demo/admin/contracts/specific">
        <AdminDemoLayout><AdminContractSpecificDemo /></AdminDemoLayout>
      </Route>
      <Route path="/demo/admin/contracts/new">
        <AdminDemoLayout><AdminNewContractDemo /></AdminDemoLayout>
      </Route>
      <Route path="/demo/admin/profile">
        <AdminDemoLayout><AdminProfileDemo /></AdminDemoLayout>
      </Route>
      <Route path="/demo/admin/users">
        <AdminDemoLayout><AdminUserManagementDemo /></AdminDemoLayout>
      </Route>

      <Route path="/demo/client/dashboard">
        <ClientDemoLayout><ClientDashboardDemo /></ClientDemoLayout>
      </Route>
      <Route path="/demo/client/contracts">
        <ClientDemoLayout><ClientContractsDemo /></ClientDemoLayout>
      </Route>
      <Route path="/demo/client/contracts/view">
        <ClientDemoLayout><ClientContractViewDemo /></ClientDemoLayout>
      </Route>
      <Route path="/demo/client/profile">
        <ClientDemoLayout><ClientProfileDemo /></ClientDemoLayout>
      </Route>

      <Route path="/demo/employee/dashboard">
        <EmployeeDemoLayout><EmployeeDashboardDemo /></EmployeeDemoLayout>
      </Route>
      <Route path="/demo/employee/contracts">
        <EmployeeDemoLayout><EmployeeContractsDemo /></EmployeeDemoLayout>
      </Route>
      <Route path="/demo/employee/contracts/specific">
        <EmployeeDemoLayout><EmployeeContractSpecificDemo /></EmployeeDemoLayout>
      </Route>
      <Route path="/demo/employee/profile">
        <EmployeeDemoLayout><EmployeeProfileDemo /></EmployeeDemoLayout>
      </Route>
      {/* Unauthenticated routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      {/* Authenticated routes */}
      {isAuthenticated ? (
        <ProtectedLayout>
          <Switch>
            {user?.role === 'client' && (
              <>
                <Route path="/dashboard" component={ClientDashboard} />
                <Route path="/profile" component={ClientProfile} />
                <Route path="/contracts" component={ClientContracts} />
                <Route path="/contracts/:id" component={ClientContractView} />
              </>
            )}
            {user?.role === 'employee' && (
              <>
                <Route path="/dashboard" component={EmployeeDashboard} />
                <Route path="/profile" component={EmployeeProfile} />
                <Route path="/contracts" component={EmployeeContracts} />
                <Route path="/contracts/:id" component={EmployeeContractSpecific} />
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <Route path="/dashboard" component={AdminDashboard} />
                <Route path="/profile" component={AdminProfile} />
                <Route path="/contracts" component={AdminContracts} />
                <Route path="/contracts/:id" component={AdminContractSpecific} />
                <Route path="/contracts/new" component={AdminNewContract} />
                <Route path="/users" component={AdminUserManagement} />
              </>
            )}
            <Route component={NotFound} />
          </Switch>
        </ProtectedLayout>
      ) : (
        <PublicLayout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/about/founders" component={Founders} />
            <Route path="/about/company" component={Company} />
            <Route path="/services" component={Services} />
            <Route path="/services/:slug" component={ServiceDetail} />
            <Route path="/contact" component={Contact} />
            <Route path="/policy" component={Policy} />
            <Route component={NotFound} />
          </Switch>
        </PublicLayout>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <NavigationBar />
          <div className="pt-16 min-h-screen flex flex-col bg-background">
            <Toaster />
            <Router />
            {/* <Footer /> Removed to prevent double rendering */}
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
