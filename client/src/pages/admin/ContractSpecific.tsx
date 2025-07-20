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
import { Contract, Comment as CommentType, User as UserType } from "@shared/types";

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
  const { data: contract, isLoading: contractLoading, error: contractError } = useQuery<Contract, Error>({
    queryKey: ["/api/contracts", id],
    retry: false,
  });

  useEffect(() => {
    if (contractError && isUnauthorizedError(contractError)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [contractError, toast]);

  // Fetch contract comments
  const { data: comments, isLoading: commentsLoading, error: commentsError } = useQuery<CommentType[], Error>({
    queryKey: ["/api/contracts", id, "comments"],
    retry: false,
  });

  useEffect(() => {
    if (commentsError && isUnauthorizedError(commentsError)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [commentsError, toast]);

  // Fetch users for assignment dropdowns
  const { data: users, error: usersError } = useQuery<UserType[], Error>({
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
        name: contract.name || "",
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{contract.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <PDFViewer
                    pdfUrl={contract.pdfUrl || ""}
                    contractId={Number(contract.id)}
                    onLineSelect={(lineNumber) => {
                      console.log("Selected line:", lineNumber);
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Client</p>
                    <p className="text-navyblue">
                      {contract.clientId ? getUserName(contract.clientId) : "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Assigned Employee</p>
                    <p className="text-navyblue">
                      {contract.assignedEmployeeId ? getUserName(contract.assignedEmployeeId) : "Not assigned"}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <CommentSystem
                    contractId={Number(contract.id)}
                    comments={comments as any || []}
                    isLoading={commentsLoading}
                    currentUser={user}
                    canReply={true}
                    canAddComments={true}
                    canModerate={true}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="w-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Contract
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Contract
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
