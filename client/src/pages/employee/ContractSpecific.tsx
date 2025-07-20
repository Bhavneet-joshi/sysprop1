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
  Monitor
} from "lucide-react";
import { Link } from "wouter";

export default function EmployeeContractSpecific() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    status: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

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

  if (!isAuthenticated) {
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
                The contract you're looking for doesn't exist or you don't have access to it.
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

  const handleSaveEdit = () => {
    updateContractMutation.mutate(editForm);
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
                  <Input
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="mt-2 text-gray-600 border-none p-0 h-auto"
                    placeholder="Contract description"
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
                      {updateContractMutation.isPending ? "Saving..." : "Save"}
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
                {contract.contractValue && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Contract Value</p>
                    <p className="text-navyblue">₹{contract.contractValue.toLocaleString()}</p>
                  </div>
                )}
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
                  <p className="text-sm font-medium text-gray-700">Assigned Employee</p>
                  <p className="text-navyblue">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Employee ID</p>
                  <p className="text-navyblue">{user?.employeeId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Client</p>
                  <p className="text-navyblue">Client ID: {contract.clientId}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contract Content */}
          <Tabs defaultValue="document" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="document">Contract Document</TabsTrigger>
              <TabsTrigger value="comments" className="relative">
                Comments & Collaboration
                {comments && comments.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {comments.length}
                  </span>
                )}
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
                        Add Document
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
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedLayout>
  );
}
