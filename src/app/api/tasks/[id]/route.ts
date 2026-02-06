// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   try {
//     const { id } = await params;
//     const body = await request.json();
//     const { status, title, description, priority } = body;

//     const updateData: any = {};
//     if (status !== undefined) updateData.status = status;
//     if (title !== undefined) updateData.title = title.trim();
//     if (description !== undefined)
//       updateData.description = description?.trim() || null;
//     if (priority !== undefined) updateData.priority = priority;

//     if (status === "COMPLETED") {
//       updateData.completedAt = new Date();
//     } else if (status && status !== "COMPLETED") {
//       updateData.completedAt = null;
//     }

//     const task = await prisma.task.update({
//       where: { id: id },
//       data: updateData,
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         status: true,
//         priority: true,
//         createdAt: true,
//         completedAt: true,
//       },
//     });

//     return NextResponse.json(task);
//   } catch (error) {
//     console.error("Database error:", error);
//     return NextResponse.json(
//       { error: "Failed to update task" },
//       { status: 500 },
//     );
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   const { id } = await params;

//   try {
//     await prisma.task.delete({
//       where: { id },
//       select: { id: true },
//     });

//     return NextResponse.json({ message: "Task deleted successfully" });
//   } catch (error) {
//     console.error("Database error:", error);
//     return NextResponse.json(
//       { error: "Failed to delete task" },
//       { status: 500 },
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { tasks } from "@/lib/db/schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { status, title, description, priority } = body;

    const updateData: Partial<typeof tasks.$inferInsert> = {};

    if (status !== undefined) updateData.status = status;
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }
    if (priority !== undefined) updateData.priority = priority;

    if (status === "COMPLETED") {
      updateData.completedAt = new Date();
    } else if (status && status !== "COMPLETED") {
      updateData.completedAt = null;
    }

    const [task] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        priority: tasks.priority,
        createdAt: tasks.createdAt,
        completedAt: tasks.completedAt,
      });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const deleted = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning({ id: tasks.id });

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}
