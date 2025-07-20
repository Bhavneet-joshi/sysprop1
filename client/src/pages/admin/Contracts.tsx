import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "wouter";
import ProtectedLayout from "@/components/ProtectedLayout";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  FileText, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Contract, User } from "@shared/types";

export default function AdminContracts() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      toast({
        title: "Unauthorized",
        description: "You don't have admin access.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user?.role, toast]);

  // Fetch all contracts
  const { data: contracts, isLoading: contractsLoading, refetch, error: contractsError } = useQuery<Contract[], Error>({
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

  // Fetch users for filters
  const { data: users, error: usersError } = useQuery<User[], Error>({
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

  if (isLoading) {
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

  // Filter and sort contracts
  const filteredContracts = (contracts || [])
    .filter(contract => {
      const matchesSearch = (contract.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (contract.description || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
      const matchesClient = clientFilter === "all" || contract.clientId === clientFilter;
      const matchesEmployee = employeeFilter === "all" || contract.assignedEmployeeId === employeeFilter;
      return matchesSearch && matchesStatus && matchesClient && matchesEmployee;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.contractDate || 0).getTime() - new Date(a.contractDate || 0).getTime();
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "status":
          return a.status.localeCompare(b.status);
        case "value":
          return (b.contractValue || 0) - (a.contractValue || 0);
        default:
          return 0;
      }
    });

  // Get unique clients and employees for filters
  const clients = users?.filter(u => u.role === "client") || [];
  const employees = users?.filter(u => u.role === "employee") || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getUserName = (userId: string) => {
    const foundUser = users?.find(u => u.id === userId);
    return foundUser ? `${foundUser.firstName} ${foundUser.lastName}` : userId;
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>All Contracts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <Input
                      placeholder="Search contracts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-xs"
                    />
                    <Link href="/contracts/new">
                      <Button className="btn-primary text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        New Contract
                      </Button>
                    </Link>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contract</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{contract.name}</p>
                              <p className="text-sm text-gray-500">
                                {contract.contractDate && formatDate(contract.contractDate)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {contract.clientId ? getUserName(contract.clientId) : "Unassigned"}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(contract.status)}>
                              {contract.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link href={`/contracts/${contract.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Contracts</span>
                    <span>{contracts?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active</span>
                    <span>{contracts?.filter(c => c.status === "active").length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Progress</span>
                    <span>{contracts?.filter(c => c.status === "in_progress").length || 0}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/contracts/new">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      New Contract
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh List
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
