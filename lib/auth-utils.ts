import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

export async function requireRole(role: string) {
  const user = await requireAuth();
  if (user.role !== role) {
    redirect("/");
  }
  return user;
}

export async function requireAdmin() {
  return requireRole("admin");
}

export async function requireBusiness() {
  return requireRole("business");
}
