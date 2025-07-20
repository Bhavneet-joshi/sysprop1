import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProtectedLayout from "@/components/ProtectedLayout";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  UserPlus,
  Search, 
  Filter, 
  RefreshCw,
  MoreHorizontal,
  Edit,
  Trash2,
  Key,
  Shield,
  Mail,
  Phone,
  Calendar,
  Building,
  Settings,
  UserCheck,
  UserX
} from "lucide-react";

export default function AdminUserManagement() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

  // Fetch all users
  const { data: users, isLoading: usersLoading, refetch } = useQuery({
    queryKey: ["/api/users"],
    retry: false,
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    },
  });

  // Update user role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      await apiRequest("PUT", `/api/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Role Updated",
        description: "User role has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Update Failed",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update user profile mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => {
      await apiRequest("PUT", `/api/users/${userId}/profile`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsEditDialogOpen(false);
      toast({
        title: "User Updated",
        description: "User information has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Update Failed",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || usersLoading) {
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

  // Filter users
  const filteredUsers = (users || [])
    .filter(u => {
      const matchesSearch = u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "active" && u.isActive) ||
                           (statusFilter === "inactive" && !u.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "employee":
        return "bg-blue-100 text-blue-800";
      case "client":
        return "bg-green-100 text-green-800";
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

  const userStats = {
    total: users?.length || 0,
    clients: users?.filter(u => u.role === "client").length || 0,
    employees: users?.filter(u => u.role === "employee").length || 0,
    admins: users?.filter(u => u.role === "admin").length || 0,
    active: users?.filter(u => u.isActive).length || 0,
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-navyblue mb-2">User Management</h1>
                <p className="text-gray-600">
                  Manage user accounts, roles, and permissions across the system.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  disabled={usersLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${usersLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button className="btn-primary text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-navyblue" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-navyblue">{userStats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                <Building className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{userStats.clients}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employees</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{userStats.employees}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                <Shield className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{userStats.admins}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">User Accounts</TabsTrigger>
              <TabsTrigger value="permissions">Access Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-navyblue">
                    <Filter className="mr-2 h-5 w-5" />
                    Filters & Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="client">Clients</SelectItem>
                        <SelectItem value="employee">Employees</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-navyblue">
                    <Users className="mr-2 h-5 w-5" />
                    User Accounts ({filteredUsers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No users found</p>
                      <p className="text-sm text-gray-400 mb-6">
                        {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "No users have been created yet"
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((u) => (
                            <TableRow key={u.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={u.profileImageUrl || ""} alt={u.firstName || ""} />
                                    <AvatarFallback>
                                      {(u.firstName?.charAt(0) || "") + (u.lastName?.charAt(0) || "")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{u.firstName} {u.lastName}</p>
                                    <p className="text-sm text-gray-500">{u.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {u.contactNumber && (
                                    <div className="flex items-center text-sm">
                                      <Phone className="h-3 w-3 mr-1 text-gray-400" />
                                      {u.contactNumber}
                                    </div>
                                  )}
                                  {u.employeeId && (
                                    <div className="flex items-center text-sm">
                                      <Badge variant="outline" className="text-xs">
                                        ID: {u.employeeId}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={u.role}
                                  onValueChange={(role) => 
                                    updateUserRoleMutation.mutate({ userId: u.id, role })
                                  }
                                  disabled={updateUserRoleMutation.isPending}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue>
                                      <Badge className={getRoleColor(u.role)}>
                                        {u.role}
                                      </Badge>
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="client">Client</SelectItem>
                                    <SelectItem value="employee">Employee</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {u.isActive ? (
                                    <UserCheck className="h-4 w-4 text-green-600 mr-2" />
                                  ) : (
                                    <UserX className="h-4 w-4 text-red-600 mr-2" />
                                  )}
                                  <span className={u.isActive ? "text-green-600" : "text-red-600"}>
                                    {u.isActive ? "Active" : "Inactive"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                  {u.createdAt ? formatDate(u.createdAt) : "Unknown"}
                                </div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => {
                                      setSelectedUser(u);
                                      setIsEditDialogOpen(true);
                                    }}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit User
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Key className="h-4 w-4 mr-2" />
                                      Reset Password
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Deactivate User
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="permissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-navyblue">
                    <Settings className="mr-2 h-5 w-5" />
                    Access Control & Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold text-navyblue mb-4">Employee Access Management</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Configure access permissions for employees across different contracts and system areas.
                        </p>
                        
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Contract Access Levels</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Read Only</span>
                                <Badge variant="outline">Default</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Comment & Review</span>
                                <Badge variant="outline">Standard</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Edit & Modify</span>
                                <Badge variant="outline">Advanced</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Full Control</span>
                                <Badge variant="outline">Admin</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Review Workflow</h4>
                            <div className="space-y-2 text-sm">
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" defaultChecked />
                                Multi-level review required
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" defaultChecked />
                                Preparer/Reviewer separation
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Automatic assignment
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-navyblue mb-4">System Permissions</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Manage system-wide permissions and role-based access controls.
                        </p>
                        
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Administrative Functions</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>User Management</span>
                                <Badge className="bg-red-100 text-red-800">Admin Only</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Contract Creation</span>
                                <Badge className="bg-red-100 text-red-800">Admin Only</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>System Settings</span>
                                <Badge className="bg-red-100 text-red-800">Admin Only</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Audit Logs</span>
                                <Badge className="bg-red-100 text-red-800">Admin Only</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Data Access Controls</h4>
                            <div className="space-y-2 text-sm">
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" defaultChecked />
                                Role-based data filtering
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" defaultChecked />
                                Client data isolation
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" defaultChecked />
                                Audit trail logging
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button variant="outline">
                        Export Permissions
                      </Button>
                      <Button className="btn-golden text-white">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Edit User Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit User: {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        defaultValue={selectedUser.firstName}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue={selectedUser.lastName}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={selectedUser.email}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      defaultValue={selectedUser.contactNumber}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="btn-primary text-white"
                      disabled={updateUserMutation.isPending}
                    >
                      {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedLayout>
  );
}
