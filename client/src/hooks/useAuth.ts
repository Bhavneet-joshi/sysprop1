import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@shared/types";

async function fetchUser(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/user");
    if (response.status === 401) {
      return null;
    }
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
}

export function useAuth() {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User | null, Error>({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    queryClient.setQueryData(['user'], null);
    window.location.href = '/login';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    logout,
  };
}
