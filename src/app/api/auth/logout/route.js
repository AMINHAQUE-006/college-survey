import { signOut } from "@/auth";
import { handleApiError, success } from "@/lib/api";
export async function POST() {
  try {
    await signOut({ redirect: false });
    return success({}, "Logout successful");
  } catch (error) {
    return handleApiError(error);
  }
}
