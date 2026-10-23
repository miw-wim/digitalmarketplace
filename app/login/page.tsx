"use client";
import { useRouter } from "next/navigation";
import SignInModal from "@/components/SignInModal";

export default function LoginPage() {
  const router = useRouter();
  return <SignInModal onClose={() => router.push("/")} />;
}
