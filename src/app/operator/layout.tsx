import { OperatorLayout } from "@/components/operator/OperatorLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <OperatorLayout>{children}</OperatorLayout>;
}
