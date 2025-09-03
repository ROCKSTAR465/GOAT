import { NextRequest, NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/services/firestore';
import { Script, ScriptTone } from '@/lib/types/models';

// Mock AI content generation - in production, this would call an actual AI service
function generateScriptVariations(prompt: string, tone: ScriptTone): string[] {
  const variations = {
    professional: [
      `Professional Opening: Welcome to our comprehensive overview of ${prompt}. Today, we'll explore the key aspects that make this topic essential for modern businesses.`,
      `Executive Summary: In this presentation, we'll examine ${prompt} through a strategic lens, focusing on actionable insights and measurable outcomes.`,
      `Industry Perspective: As leaders in the field, we understand that ${prompt} requires a thoughtful approach backed by data and expertise.`,
    ],
    casual: [
      `Hey there! Let's dive into ${prompt} and break it down in a way that actually makes sense. No jargon, just real talk.`,
      `What's up, everyone? Today we're chatting about ${prompt} - and trust me, it's way more interesting than it sounds!`,
      `Alright, let's get into ${prompt}. I'll keep it simple and fun - promise this won't be boring!`,
    ],
    humorous: [
      `So, ${prompt} walks into a bar... Just kidding! But seriously, let's make learning about this topic actually enjoyable.`,
      `Warning: This content about ${prompt} may cause sudden bursts of knowledge and occasional chuckles. Viewer discretion is advised.`,
      `They say ${prompt} is complicated. They also said the earth was flat. Let's prove them wrong on the first one!`,
    ],
    inspirational: [
      `Every great journey begins with a single step. Today, your journey into ${prompt} starts here, and it's going to be transformative.`,
      `Imagine a world where ${prompt} isn't just understood, but mastered. That world starts with you, right now.`,
      `The power of ${prompt} lies not in its complexity, but in its potential to change everything. Let's unlock that potential together.`,
    ],
    educational: [
      `Learning Objective: By the end of this session on ${prompt}, you'll understand the fundamental concepts and practical applications.`,
      `Module 1: Introduction to ${prompt}. We'll start with the basics and gradually build your expertise through structured learning.`,
      `Today's lesson on ${prompt} is designed to provide comprehensive knowledge while maintaining engagement through interactive examples.`,
    ],
  };

  return variations[tone] || variations.professional;
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { prompt, tone = 'professional', target_audience, duration } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { code: 400, message: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate script variations
    const variations = generateScriptVariations(prompt, tone as ScriptTone);

    // Save the main script to Firestore
    const scriptId = await FirestoreService.create<Script>('scripts', {
      title: `Script for: ${prompt}`,
      content: variations[0],
      tone: tone as ScriptTone,
      target_audience,
      duration,
      created_by: userId!,
      tags: [tone, 'ai-generated'],
    });

    // Save variations as versions
    for (let i = 0; i < variations.length; i++) {
      await FirestoreService.create(`scripts/${scriptId}/versions`, {
        scriptId,
        version_number: i + 1,
        content: variations[i],
        changes_summary: `Variation ${i + 1} with ${tone} tone`,
        created_by: userId!,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        scriptId,
        variations: variations.map((content, index) => ({
          version: index + 1,
          content,
          tone,
        })),
      },
      message: 'Scripts generated successfully',
    });
  } catch (error: any) {
    console.error('Error generating scripts:', error);
    return NextResponse.json(
      { code: 500, message: 'Failed to generate scripts' },
      { status: 500 }
    );
  }
}
