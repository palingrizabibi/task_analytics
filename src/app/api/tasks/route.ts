// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const tasks = await prisma.task.findMany({
//       orderBy: { createdAt: "desc" },
//     });
//     return NextResponse.json(tasks);
//   } catch (error) {
//     console.error("Database error:", error);
//     return NextResponse.json(
//       { error: "Database connection failed" },
//       { status: 500 },
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { title, description, priority } = body;

//     if (!title?.trim()) {
//       return NextResponse.json({ error: "Title is required" }, { status: 400 });
//     }

//     const task = await prisma.task.create({
//       data: {
//         title: title.trim(),
//         description: description || null,
//         priority: priority || "MEDIUM",
//       },
//     });

//     return NextResponse.json(task, { status: 201 });
//   } catch (error) {
//     console.error("Database error:", error);
//     return NextResponse.json(
//       { error: "Database error occurred" },
//       { status: 500 },
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

/**
 * GET /api/tasks
 * Fetch all tasks ordered by creation date (newest first)
 */
export async function GET() {
  try {
    const allTasks = await db
      .select()
      .from(tasks)
      .orderBy(desc(tasks.createdAt));

    return NextResponse.json(allTasks);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, priority } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [task] = await db
      .insert(tasks)
      .values({
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority ?? "MEDIUM",
      })
      .returning();

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database error occurred" },
      { status: 500 },
    );
  }
}
