import { useAuth } from "@/hooks/useAuth";
import PublicLayout from "./PublicLayout";
import ProtectedLayout from "./ProtectedLayout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <ProtectedLayout>{children}</ProtectedLayout>;
  }

  return <PublicLayout>{children}</PublicLayout>;
}
