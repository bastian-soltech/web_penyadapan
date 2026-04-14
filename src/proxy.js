import { updateSession } from "./app/lib/middleware";

export async function proxy(request) {
  return await updateSession(request);
}

export const config = {
   matcher: [
   '/((?!_next/static|_next/image|favicon.ico|auth/confirm|api/get-spreadsheet).*)',
  ],
};