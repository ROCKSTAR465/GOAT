import { NextRequest, NextResponse } from 'next/server';
import { TaskService, FirestoreService } from '@/lib/services/firestore';
import { Task } from '@/lib/types/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await FirestoreService.getById<Task>('tasks', id);

    if (!task) {
      return NextResponse.json(
        { code: 404, message: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: task });
  } catch (error: any) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { code: 500, message: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData = await request.json();

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.created_by;

    await FirestoreService.update('tasks', id, updateData);
    const updatedTask = await FirestoreService.getById<Task>('tasks', id);

    return NextResponse.json({ 
      success: true, 
      data: updatedTask,
      message: 'Task updated successfully' 
    });
  } catch (error: any) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { code: 500, message: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userRole = request.headers.get('x-user-role');

    // Only executives can delete tasks
    if (userRole !== 'executive') {
      return NextResponse.json(
        { code: 403, message: 'Only executives can delete tasks' },
        { status: 403 }
      );
    }

    await FirestoreService.delete('tasks', id);

    return NextResponse.json({ 
      success: true, 
      message: 'Task deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { code: 500, message: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
