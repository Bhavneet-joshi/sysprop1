import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProtectedLayout from "@/components/ProtectedLayout";
import PDFViewer from "@/components/PDFViewer";
import CommentSystem from "@/components/CommentSystem";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { 
  FileText, 
  Download, 
  Calendar,
  User,
  Building,
  ArrowLeft,
  MessageCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  ExternalLink,
  Monitor,
  Users,
  Settings
} from "lucide-react";
import { Link } from "wouter";

export default function AdminContractSpecific() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    status: "",
    clientId: "",
    assignedEmployeeId: "",
    contractValue: "",
    startDate: "",
    endDate: "",
  });

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

  // Fetch contract details
  const { data: contract, isLoading: contractLoading } = useQuery({
    queryKey: ["/api/contracts", id],
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

  // Fetch contract comments
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["/api/contracts", id, "comments"],
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

  // Fetch users for assignment dropdowns
  const { data: users } = useQuery({
    queryKey: ["/api/users"],
    retry: false,
  });

  // Fetch contract permissions
  const { data: permissions } = useQuery({
    queryKey: ["/api/contracts", id, "permissions"],
    retry: false,
  });

  // Update contract mutation
  const updateContractMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", `/api/contracts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts", id] });
      setIsEditing(false);
      toast({
        title: "Contract Updated",
        description: "Contract has been successfully updated.",
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
        description: "Failed to update contract. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete contract mutation
  const deleteContractMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/contracts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Contract Deleted",
        description: "Contract has been successfully deleted.",
      });
      window.location.href = "/contracts";
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
        title: "Delete Failed",
        description: "Failed to delete contract. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (contract) {
      setEditForm({
        name: contract.name,
        description: contract.description || "",
        status: contract.status,
        clientId: contract.clientId || "",
        assignedEmployeeId: contract.assignedEmployeeId || "",
        contractValue: contract.contractValue?.toString() || "",
        startDate: contract.startDate || "",
        endDate: contract.endDate || "",
      });
    }
  }, [contract]);

  if (isLoading || contractLoading) {
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

  if (!contract) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Contract Not Found</h1>
              <p className="text-gray-600 mb-6">
                The contract you're looking for doesn't exist.
              </p>
              <Link href="/contracts">
                <Button className="btn-primary text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Contracts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

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
      month: "long",
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

  const clients = users?.filter(u => u.role === "client") || [];
  const employees = users?.filter(u => u.role === "employee") || [];

  const handleSaveEdit = () => {
    const updateData = {
      ...editForm,
      contractValue: editForm.contractValue ? parseInt(editForm.contractValue) : undefined,
    };
    updateContractMutation.mutate(updateData);
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/contracts">
                  <Button variant="ghost" className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Contracts
                  </Button>
                </Link>
                <div className="flex items-center space-x-4">
                  {isEditing ? (
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="text-2xl font-bold border-none p-0 h-auto text-navyblue"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-navyblue">{contract.name}</h1>
                  )}
                  <Badge className={getStatusColor(contract.status)}>
                    {contract.status}
                  </Badge>
                </div>
                {isEditing ? (
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="mt-2 text-gray-600 border-none p-0 h-auto resize-none"
                    placeholder="Contract description"
                    rows={2}
                  />
                ) : (
                  <p className="text-gray-600 mt-2">
                    {contract.description || "No description provided"}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSaveEdit}
                      className="btn-primary text-white"
                      disabled={updateContractMutation.isPending}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateContractMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Contract
                    </Button>
                    {contract.pdfUrl && (
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    )}
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Online
                    </Button>
                    <Button variant="outline">
                      <Monitor className="h-4 w-4 mr-2" />
                      Open on Desktop
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Contract</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>Are you sure you want to delete this contract? This action cannot be undone.</p>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() => deleteContractMutation.mutate()}
                              disabled={deleteContractMutation.isPending}
                            >
                              {deleteContractMutation.isPending ? "Deleting..." : "Delete Contract"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-navyblue">
                  <Calendar className="mr-2 h-5 w-5" />
                  Contract Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Contract Date</p>
                  <p className="text-navyblue">{formatDate(contract.contractDate)}</p>
                </div>
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={editForm.startDate}
                        onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={editForm.endDate}
                        onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {contract.startDate && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Start Date</p>
                        <p className="text-navyblue">{formatDate(contract.startDate)}</p>
                      </div>
                    )}
                    {contract.endDate && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">End Date</p>
                        <p className="text-navyblue">{formatDate(contract.endDate)}</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-navyblue">
                  <User className="mr-2 h-5 w-5" />
                  Contract Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Contract ID</p>
                  <p className="text-navyblue">#{contract.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  {isEditing ? (
                    <Select 
                      value={editForm.status} 
                      onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Contract Value</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editForm.contractValue}
                      onChange={(e) => setEditForm({ ...editForm, contractValue: e.target.value })}
                      placeholder="Enter contract value"
                    />
                  ) : contract.contractValue ? (
                    <p className="text-navyblue">{formatCurrency(contract.contractValue)}</p>
                  ) : (
                    <p className="text-gray-500">Not specified</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-navyblue">
                  <Building className="mr-2 h-5 w-5" />
                  Assignment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Client</p>
                  {isEditing ? (
                    <Select 
                      value={editForm.clientId} 
                      onValueChange={(value) => setEditForm({ ...editForm, clientId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.firstName} {client.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-navyblue">
                      {contract.clientId ? getUserName(contract.clientId) : "Not assigned"}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Assigned Employee</p>
                  {isEditing ? (
                    <Select 
                      value={editForm.assignedEmployeeId} 
                      onValueChange={(value) => setEditForm({ ...editForm, assignedEmployeeId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-navyblue">
                      {contract.assignedEmployeeId ? getUserName(contract.assignedEmployeeId) : "Not assigned"}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Company</p>
                  <p className="text-navyblue">HLSG Industries</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contract Content */}
          <Tabs defaultValue="document" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="document">Contract Document</TabsTrigger>
              <TabsTrigger value="comments" className="relative">
                Comments & Collaboration
                {comments && comments.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {comments.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="permissions">
                User Permissions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="document" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-navyblue">
                    <FileText className="mr-2 h-5 w-5" />
                    Contract Document
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contract.pdfUrl ? (
                    <PDFViewer 
                      pdfUrl={contract.pdfUrl} 
                      contractId={contract.id}
                      onLineSelect={(lineNumber) => {
                        console.log("Selected line:", lineNumber);
                      }}
                    />
                  ) : contract.pdfContent ? (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">
                        {contract.pdfContent}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No document content available</p>
                      <Button className="mt-4 btn-primary text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-navyblue">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Contract Comments & Collaboration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CommentSystem
                    contractId={contract.id}
                    comments={comments || []}
                    isLoading={commentsLoading}
                    currentUser={user}
                    canReply={true}
                    canAddComments={true}
                    canModerate={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-navyblue">
                    <Users className="mr-2 h-5 w-5" />
                    User Access & Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-navyblue mb-4">Employee Permissions</h3>
                        <div className="space-y-4">
                          {employees.map((employee) => (
                            <div key={employee.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{employee.firstName} {employee.lastName}</span>
                                <Badge variant="outline">Employee</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <label className="flex items-center">
                                  <input type="checkbox" className="mr-2" />
                                  Read Access
                                </label>
                                <label className="flex items-center">
                                  <input type="checkbox" className="mr-2" />
                                  Write Access
                                </label>
                                <label className="flex items-center">
                                  <input type="checkbox" className="mr-2" />
                                  Edit Access
                                </label>
                                <label className="flex items-center">
                                  <input type="checkbox" className="mr-2" />
                                  Delete Access
                                </label>
                              </div>
                              <div className="mt-2 pt-2 border-t">
                                <label className="flex items-center">
                                  <input type="checkbox" className="mr-2" />
                                  <span className="text-sm">Is Reviewer</span>
                                </label>
                                <label className="flex items-center">
                                  <input type="checkbox" className="mr-2" />
                                  <span className="text-sm">Is Preparer</span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-navyblue mb-4">Access Summary</h3>
                        <div className="space-y-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Multi-level Review</h4>
                            <p className="text-sm text-blue-800">
                              Configure multiple review levels for contract approval workflow.
                            </p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-2">Collaborative Editing</h4>
                            <p className="text-sm text-green-800">
                              Allow multiple team members to collaborate on contract documents.
                            </p>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-medium text-yellow-900 mb-2">Access Control</h4>
                            <p className="text-sm text-yellow-800">
                              Granular permissions ensure data security and compliance.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Advanced Settings
                      </Button>
                      <Button className="btn-golden text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Save Permissions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedLayout>
  );
}
