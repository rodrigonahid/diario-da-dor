import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { painEntries, treatmentForms } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const { userId, bodyPart, painLevel, formData } = await request.json();

    if (!userId || !bodyPart || painLevel === undefined) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    const [painEntry] = await db.insert(painEntries).values({
      userId,
      bodyPart,
      painLevel,
    }).returning();

    if (formData) {
      await db.insert(treatmentForms).values({
        painEntryId: painEntry.id,
        formData: JSON.stringify(formData),
      });
    }

    return NextResponse.json({ 
      success: true, 
      painEntry 
    });
  } catch (error) {
    console.error('Pain entry error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
