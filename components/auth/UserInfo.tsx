import { auth } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export async function UserInfo() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex gap-2">
        <a
          href="/login"
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          ログイン
        </a>
        <a
          href="/register"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          新規登録
        </a>
      </div>
    );
  }

  const { user } = session;
  const roleLabel = {
    user: "一般ユーザー",
    business: "事業者",
    admin: "管理者",
  }[user.role] || user.role;

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <p className="font-medium">{user.name || user.email}</p>
        <p className="text-gray-500">{roleLabel}</p>
      </div>
      <LogoutButton />
    </div>
  );
}
