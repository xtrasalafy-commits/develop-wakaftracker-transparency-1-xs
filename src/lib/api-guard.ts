import { getCurrentUser } from "@/lib/auth";
import type { User } from "@/db/schema";

export async function requireNazhir(): Promise<
  { user: User; response?: undefined } | { user?: undefined; response: Response }
> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN_NAZHIR") {
    return {
      response: Response.json({ error: "Akses khusus nazhir" }, { status: 403 }),
    };
  }
  return { user };
}

export function zodError(error: { issues: Array<{ message: string }> }) {
  return Response.json({ error: error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
}
