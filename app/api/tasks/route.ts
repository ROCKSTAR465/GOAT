import { NextRequest, NextResponse } from 'next/server';
import { TaskService, FirestoreService } from '@/lib/services/firestore';
import { Task } from '@/lib/types/models';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');

    let tasks: Task[];

    if (assignedTo) {
      tasks = await TaskService.getTasksByUser(assignedTo);
    } else if (status) {
      tasks = await TaskService.getTasksByStatus(status);
    } else if (userId) {
      tasks = await TaskService.getTasksByUser(userId);
    } else {
      tasks = await FirestoreService.getMany<Task>('tasks');
    }

    return NextResponse.json({ success: true, data: tasks });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { code: 500, message: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const taskData = await request.json();

    if (!taskData.title || !taskData.deadline) {
      return NextResponse.json(
        { code: 400, message: 'Title and deadline are required' },
        { status: 400 }
      );
    }

    const taskId = await TaskService.createTask({
      ...taskData,
      created_by: userId,
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      assigned_to: taskData.assigned_to || [userId],
    });

    const newTask = await FirestoreService.getById<Task>('tasks', taskId);

    return NextResponse.json({ 
      success: true, 
      data: newTask,
      message: 'Task created successfully' 
    });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { code: 500, message: 'Failed to create task' },
      { status: 500 }
    );
  }
}
