import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ProtectedLayout from "@/components/ProtectedLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { contractFormSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  FileText, 
  ArrowLeft,
  Save,
  User,
  Calendar,
  DollarSign,
  Upload,
  Building,
  Users,
  Settings
} from "lucide-react";
import { Link } from "wouter";

type ContractFormData = z.infer<typeof contractFormSchema>;

export default function AdminNewContract() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employeePermissions, setEmployeePermissions] = useState<Record<string, any>>({});

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

  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
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

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      name: "",
      description: "",
      clientId: "",
      assignedEmployeeId: "",
      contractDate: new Date().toISOString().split('T')[0],
      startDate: "",
      endDate: "",
    }
  });

  // Create contract mutation
  const createContractMutation = useMutation({
    mutationFn: async (data: ContractFormData) => {
      const response = await apiRequest("POST", "/api/contracts", data);
      return response.json();
    },
    onSuccess: (newContract) => {
      toast({
        title: "Contract Created",
        description: "Contract has been successfully created.",
      });
      
      // Set employee permissions if any selected
      if (selectedEmployees.length > 0) {
        selectedEmployees.forEach(async (employeeId) => {
          const permissions = employeePermissions[employeeId] || {};
          await apiRequest("POST", "/api/permissions", {
            employeeId,
            contractId: newContract.id,
            ...permissions,
          });
        });
      }
      
      window.location.href = `/contracts/${newContract.id}`;
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
        title: "Creation Failed",
        description: "Failed to create contract. Please try again.",
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

  const clients = users?.filter(u => u.role === "client") || [];
  const employees = users?.filter(u => u.role === "employee") || [];

  const onSubmit = (data: ContractFormData) => {
    createContractMutation.mutate(data);
  };

  const handleEmployeeSelection = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
      setEmployeePermissions({
        ...employeePermissions,
        [employeeId]: {
          canRead: true,
          canWrite: false,
          canEdit: false,
          canDelete: false,
          isReviewer: false,
          isPreparer: false,
        }
      });
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
      const { [employeeId]: removed, ...rest } = employeePermissions;
      setEmployeePermissions(rest);
    }
  };

  const updateEmployeePermission = (employeeId: string, permission: string, value: boolean) => {
    setEmployeePermissions({
      ...employeePermissions,
      [employeeId]: {
        ...employeePermissions[employeeId],
        [permission]: value,
      }
    });
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/contracts">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Contracts
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-navyblue mb-2">Create New Contract</h1>
            <p className="text-gray-600">
              Add a new contract and assign it to clients and employees.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-navyblue">
                    <FileText className="mr-2 h-5 w-5" />
                    Contract Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contract name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter contract description"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="contractDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contract Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date (Optional)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date (Optional)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-navyblue">
                    <User className="mr-2 h-5 w-5" />
                    Client & Employee Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assign to Client</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.firstName} {client.lastName} - {client.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="assignedEmployeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Assigned Employee</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an employee" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {employees.map((employee) => (
                                <SelectItem key={employee.id} value={employee.id}>
                                  {employee.firstName} {employee.lastName} - {employee.employeeId}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-medium">Contract Value (Optional)</Label>
                    <div className="mt-2">
                      <Input
                        type="number"
                        placeholder="Enter contract value in INR"
                        onChange={(e) => form.setValue('contractValue' as any, e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Employee Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-navyblue">
                    <Users className="mr-2 h-5 w-5" />
                    Employee Access & Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600">
                      Select employees who should have access to this contract and configure their permissions.
                    </p>

                    <div className="space-y-4">
                      {employees.map((employee) => (
                        <div key={employee.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={selectedEmployees.includes(employee.id)}
                                onCheckedChange={(checked) => 
                                  handleEmployeeSelection(employee.id, checked as boolean)
                                }
                              />
                              <div>
                                <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                                <p className="text-sm text-gray-500">ID: {employee.employeeId}</p>
                              </div>
                            </div>
                          </div>

                          {selectedEmployees.includes(employee.id) && (
                            <div className="ml-6 space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Basic Permissions</Label>
                                  <div className="space-y-1">
                                    <label className="flex items-center text-sm">
                                      <Checkbox
                                        checked={employeePermissions[employee.id]?.canRead || false}
                                        onCheckedChange={(checked) => 
                                          updateEmployeePermission(employee.id, 'canRead', checked as boolean)
                                        }
                                        className="mr-2"
                                      />
                                      Read Access
                                    </label>
                                    <label className="flex items-center text-sm">
                                      <Checkbox
                                        checked={employeePermissions[employee.id]?.canWrite || false}
                                        onCheckedChange={(checked) => 
                                          updateEmployeePermission(employee.id, 'canWrite', checked as boolean)
                                        }
                                        className="mr-2"
                                      />
                                      Write Access
                                    </label>
                                    <label className="flex items-center text-sm">
                                      <Checkbox
                                        checked={employeePermissions[employee.id]?.canEdit || false}
                                        onCheckedChange={(checked) => 
                                          updateEmployeePermission(employee.id, 'canEdit', checked as boolean)
                                        }
                                        className="mr-2"
                                      />
                                      Edit Access
                                    </label>
                                    <label className="flex items-center text-sm">
                                      <Checkbox
                                        checked={employeePermissions[employee.id]?.canDelete || false}
                                        onCheckedChange={(checked) => 
                                          updateEmployeePermission(employee.id, 'canDelete', checked as boolean)
                                        }
                                        className="mr-2"
                                      />
                                      Delete Access
                                    </label>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Role Assignments</Label>
                                  <div className="space-y-1">
                                    <label className="flex items-center text-sm">
                                      <Checkbox
                                        checked={employeePermissions[employee.id]?.isReviewer || false}
                                        onCheckedChange={(checked) => 
                                          updateEmployeePermission(employee.id, 'isReviewer', checked as boolean)
                                        }
                                        className="mr-2"
                                      />
                                      Reviewer
                                    </label>
                                    <label className="flex items-center text-sm">
                                      <Checkbox
                                        checked={employeePermissions[employee.id]?.isPreparer || false}
                                        onCheckedChange={(checked) => 
                                          updateEmployeePermission(employee.id, 'isPreparer', checked as boolean)
                                        }
                                        className="mr-2"
                                      />
                                      Preparer
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-navyblue">
                    <Upload className="mr-2 h-5 w-5" />
                    Document Upload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Upload contract documents from SharePoint or local files. Multiple formats supported.
                    </p>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">Upload Contract Documents</p>
                      <p className="text-sm text-gray-600 mb-4">
                        Drag and drop files here, or click to select files
                      </p>
                      <div className="flex justify-center space-x-4">
                        <Button type="button" variant="outline">
                          <Building className="h-4 w-4 mr-2" />
                          SharePoint Integration
                        </Button>
                        <Button type="button" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Local Upload
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Supported formats: PDF, DOC, DOCX, XLS, XLSX. Maximum file size: 50MB.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex justify-end space-x-4">
                <Link href="/contracts">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="btn-primary text-white"
                  disabled={createContractMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {createContractMutation.isPending ? "Creating..." : "Create Contract"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </ProtectedLayout>
  );
}
