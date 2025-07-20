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
  Calendar,
  DollarSign,
  Upload,
  Building,
  Users,
  Settings
} from "lucide-react";
import { Link } from "wouter";
import type { User, Contract } from '../../../../shared/types';

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

  const usersArray: User[] = Array.isArray(users) ? users : [];
  const clients: User[] = usersArray.filter((u: User) => u.role === "client");
  const employees: User[] = usersArray.filter((u: User) => u.role === "employee");

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contract Details</CardTitle>
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
                              <Textarea placeholder="Enter contract description" rows={4} {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Client & Employee Assignment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                                {clients.map((client: User) => (
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
                                {employees.map((employee: User) => (
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
                    </CardContent>
                  </Card>
                </form>
              </Form>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for summary */}
                  <p className="text-gray-500">Contract details will appear here.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full btn-primary text-white"
                    disabled={createContractMutation.isPending}
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {createContractMutation.isPending ? "Creating..." : "Create Contract"}
                  </Button>
                  <Link href="/contracts">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
