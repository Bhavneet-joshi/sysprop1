import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ProtectedLayout from "@/components/ProtectedLayout";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  FileText,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Building,
  Calendar
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { User, Contract } from "@shared/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      toast({
        title: "Unauthorized",
        description: "You don't have admin access.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user?.role, toast]);

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  useEffect(() => {
    if (statsError && isUnauthorizedError(statsError)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [statsError, toast]);

  // Fetch all contracts for recent activity
  const { data: contracts, isLoading: contractsLoading, error: contractsError } = useQuery<Contract[], Error>({
    queryKey: ["/api/contracts"],
    retry: false,
  });

  useEffect(() => {
    if (contractsError && isUnauthorizedError(contractsError)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [contractsError, toast]);

  // Fetch users
  const { data: users, isLoading: usersLoading, error: usersError } = useQuery<User[], Error>({
    queryKey: ["/api/users"],
    retry: false,
  });

  useEffect(() => {
    if (usersError && isUnauthorizedError(usersError)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [usersError, toast]);

  if (isLoading || statsLoading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navyblue"></div>
        </div>
      </ProtectedLayout>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const recentContracts = contracts?.slice(0, 5) || [];
  const contractStats = stats as { total: number; active: number; completed: number; cancelled: number; } || { total: 0, active: 0, completed: 0, cancelled: 0 };
  const totalUsers = users?.length || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "In Review":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  const chartData = [
    { name: 'Jan', contracts: 4 },
    { name: 'Feb', contracts: 3 },
    { name: 'Mar', contracts: 5 },
    { name: 'Apr', contracts: 6 },
    { name: 'May', contracts: 8 },
    { name: 'Jun', contracts: 10 },
  ];

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Welcome Message */}
              <Card className="bg-navyblue text-white">
                <CardHeader>
                  <CardTitle>Welcome back, {user?.firstName}!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Here's a summary of your contract management system.</p>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
                    <FileText className="h-4 w-4 text-navyblue" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-navyblue">{contractStats.total}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{contractStats.active}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/contracts/new" className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-200 transition-colors">
                    <Plus className="h-8 w-8 text-navyblue" />
                    <span className="text-sm font-medium">New Contract</span>
                  </Link>
                  <Link href="/users" className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-200 transition-colors">
                    <Users className="h-8 w-8 text-blue-600" />
                    <span className="text-sm font-medium">Manage Users</span>
                  </Link>
                  <Link href="/contracts" className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-200 transition-colors">
                    <FileText className="h-8 w-8 text-green-600" />
                    <span className="text-sm font-medium">All Contracts</span>
                  </Link>
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-200 transition-colors">
                    <TrendingUp className="h-8 w-8 text-golden" />
                    <span className="text-sm font-medium">Reports</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {contractsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse flex space-x-4">
                          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                          <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentContracts.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No recent activity</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentContracts.map((contract) => (
                        <div key={contract.id} className="flex items-start space-x-4">
                          <div className="bg-gray-100 p-2 rounded-full">
                            <FileText className="h-5 w-5 text-navyblue" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{contract.name}</p>
                            <p className="text-xs text-gray-500">
                              {contract.contractDate && formatDate(contract.contractDate)} - Status: {contract.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contract Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Contracts Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      contracts: {
                        label: "Contracts",
                        color: "hsl(var(--primary))",
                      },
                    }}
                    className="h-[200px] w-full"
                  >
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="contracts" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
