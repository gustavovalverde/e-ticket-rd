import { cookies } from "next/headers";

export const COOKIES = {
  NEXT_LOCALE: "NEXT_LOCALE",
};

export async function getCookie(name: string): Promise<string | undefined> {
  return (await cookies()).get(name)?.value;
}

export async function deleteCookie(name: string) {
  (await cookies()).delete(name);
}
