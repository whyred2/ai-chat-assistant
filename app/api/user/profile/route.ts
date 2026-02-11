import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api";

/**
 * GET /api/user/profile
 */
export const GET = withAuth(async (_request, user) => {
  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        usePersona: true,
        persona: true,
        enableSummarization: true,
        messageHistoryLimit: true,
        createdAt: true,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Failed to get user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});

/**
 * PATCH /api/user/profile
 */
export const PATCH = withAuth(async (request, user) => {
  try {
    const body = await request.json();
    const { name, persona, usePersona } = body;

    const updateData: {
      name?: string;
      persona?: string | null;
      usePersona?: boolean;
    } = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (persona !== undefined) {
      updateData.persona = persona || null;
    }

    if (usePersona !== undefined) {
      updateData.usePersona = usePersona;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        usePersona: true,
        persona: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});
