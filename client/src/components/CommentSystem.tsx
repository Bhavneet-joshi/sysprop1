import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  MessageCircle, 
  Reply, 
  Edit, 
  Trash2, 
  Check, 
  X,
  MoreHorizontal,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Comment {
  id: number;
  contractId: number;
  userId: string;
  lineNumber?: number;
  comment: string;
  isResolved: boolean;
  parentCommentId?: number;
  createdAt: string;
  updatedAt: string;
}

interface CommentSystemProps {
  contractId: number;
  comments: Comment[];
  isLoading: boolean;
  currentUser: any;
  canReply?: boolean;
  canAddComments?: boolean;
  canModerate?: boolean;
}

export default function CommentSystem({
  contractId,
  comments,
  isLoading,
  currentUser,
  canReply = true,
  canAddComments = true,
  canModerate = false
}: CommentSystemProps) {
  const [newComment, setNewComment] = useState("");
  const [newLineNumber, setNewLineNumber] = useState<number | undefined>();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [isAddCommentOpen, setIsAddCommentOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (data: { comment: string; lineNumber?: number; parentCommentId?: number }) => {
      await apiRequest("POST", `/api/contracts/${contractId}/comments`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts", contractId.toString(), "comments"] });
      setNewComment("");
      setNewLineNumber(undefined);
      setIsAddCommentOpen(false);
      toast({
        title: "Comment Added",
        description: "Your comment has been successfully added.",
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
        title: "Failed to Add Comment",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Reply to comment mutation
  const replyCommentMutation = useMutation({
    mutationFn: async (data: { comment: string; parentCommentId: number }) => {
      await apiRequest("POST", `/api/contracts/${contractId}/comments`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts", contractId.toString(), "comments"] });
      setReplyingTo(null);
      setReplyText("");
      toast({
        title: "Reply Added",
        description: "Your reply has been successfully added.",
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
        title: "Failed to Add Reply",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update comment mutation
  const updateCommentMutation = useMutation({
    mutationFn: async (data: { commentId: number; comment?: string; isResolved?: boolean }) => {
      await apiRequest("PUT", `/api/comments/${data.commentId}`, {
        comment: data.comment,
        isResolved: data.isResolved,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts", contractId.toString(), "comments"] });
      setEditingComment(null);
      setEditText("");
      toast({
        title: "Comment Updated",
        description: "Comment has been successfully updated.",
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
        title: "Failed to Update Comment",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await apiRequest("DELETE", `/api/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts", contractId.toString(), "comments"] });
      toast({
        title: "Comment Deleted",
        description: "Comment has been successfully deleted.",
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
        title: "Failed to Delete Comment",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Organize comments into threads
  const organizeComments = (comments: Comment[]) => {
    const topLevelComments = comments.filter(c => !c.parentCommentId);
    const replies = comments.filter(c => c.parentCommentId);
    
    return topLevelComments.map(comment => ({
      ...comment,
      replies: replies.filter(r => r.parentCommentId === comment.id)
    }));
  };

  const organizedComments = organizeComments(comments);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    addCommentMutation.mutate({
      comment: newComment,
      lineNumber: newLineNumber,
    });
  };

  const handleReply = (parentCommentId: number) => {
    if (!replyText.trim()) return;
    
    replyCommentMutation.mutate({
      comment: replyText,
      parentCommentId,
    });
  };

  const handleEditComment = (commentId: number) => {
    if (!editText.trim()) return;
    
    updateCommentMutation.mutate({
      commentId,
      comment: editText,
    });
  };

  const handleToggleResolved = (commentId: number, currentStatus: boolean) => {
    updateCommentMutation.mutate({
      commentId,
      isResolved: !currentStatus,
    });
  };

  const handleDeleteComment = (commentId: number) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const getCommentIcon = (comment: Comment) => {
    if (comment.isResolved) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (comment.lineNumber) {
      return <MessageCircle className="h-4 w-4 text-blue-600" />;
    }
    return <MessageCircle className="h-4 w-4 text-gray-600" />;
  };

  const getCommentStats = () => {
    const total = comments.length;
    const resolved = comments.filter(c => c.isResolved).length;
    const pending = total - resolved;
    const lineComments = comments.filter(c => c.lineNumber).length;
    
    return { total, resolved, pending, lineComments };
  };

  const stats = getCommentStats();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comment Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-navyblue">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Comments</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.lineComments}</div>
          <div className="text-sm text-gray-600">Line Comments</div>
        </div>
      </div>

      {/* Add Comment Button */}
      {canAddComments && (
        <div className="flex justify-end">
          <Dialog open={isAddCommentOpen} onOpenChange={setIsAddCommentOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Comment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="lineNumber">Line Number (Optional)</Label>
                  <Input
                    id="lineNumber"
                    type="number"
                    placeholder="Enter line number"
                    value={newLineNumber || ""}
                    onChange={(e) => setNewLineNumber(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>
                <div>
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    placeholder="Enter your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddCommentOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || addCommentMutation.isPending}
                    className="btn-primary text-white"
                  >
                    {addCommentMutation.isPending ? "Adding..." : "Add Comment"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {organizedComments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No comments yet</p>
              <p className="text-sm text-gray-400">
                Be the first to add a comment to this contract.
              </p>
            </CardContent>
          </Card>
        ) : (
          organizedComments.map((comment) => (
            <Card key={comment.id} className={comment.isResolved ? "bg-green-50 border-green-200" : ""}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Main Comment */}
                  <div className="flex space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback>
                        {comment.userId.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-navyblue">User {comment.userId}</span>
                          {comment.lineNumber && (
                            <Badge variant="outline" className="text-xs">
                              Line {comment.lineNumber}
                            </Badge>
                          )}
                          {getCommentIcon(comment)}
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                          {comment.isResolved && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canReply && (
                              <DropdownMenuItem onClick={() => setReplyingTo(comment.id)}>
                                <Reply className="h-4 w-4 mr-2" />
                                Reply
                              </DropdownMenuItem>
                            )}
                            {(comment.userId === currentUser?.id || canModerate) && (
                              <DropdownMenuItem onClick={() => {
                                setEditingComment(comment.id);
                                setEditText(comment.comment);
                              }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {canModerate && (
                              <DropdownMenuItem 
                                onClick={() => handleToggleResolved(comment.id, comment.isResolved)}
                              >
                                {comment.isResolved ? (
                                  <>
                                    <X className="h-4 w-4 mr-2" />
                                    Mark as Unresolved
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark as Resolved
                                  </>
                                )}
                              </DropdownMenuItem>
                            )}
                            {(comment.userId === currentUser?.id || canModerate) && (
                              <DropdownMenuItem 
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="mt-2">
                        {editingComment === comment.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              rows={3}
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleEditComment(comment.id)}
                                disabled={!editText.trim() || updateCommentMutation.isPending}
                                className="btn-primary text-white"
                              >
                                {updateCommentMutation.isPending ? "Saving..." : "Save"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingComment(null);
                                  setEditText("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-800 whitespace-pre-wrap">{comment.comment}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-12 space-y-3 border-l-2 border-gray-200 pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt="User" />
                            <AvatarFallback className="text-xs">
                              {reply.userId.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-navyblue text-sm">User {reply.userId}</span>
                              <span className="text-xs text-gray-500">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 mt-1">{reply.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="ml-12 space-y-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={2}
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleReply(comment.id)}
                          disabled={!replyText.trim() || replyCommentMutation.isPending}
                          className="btn-primary text-white"
                        >
                          {replyCommentMutation.isPending ? "Replying..." : "Reply"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
