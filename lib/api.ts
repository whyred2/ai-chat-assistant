import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { User } from "@/lib/generated/prisma/client";

type AuthenticatedHandler = (
  request: NextRequest,
  user: User,
) => Promise<Response | NextResponse>;

export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest) => {
    const sessionId = request.headers.get("X-Session-Id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { sessionId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return handler(request, user);
  };
}

export function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
