import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { painEntries, treatmentForms } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID de usuário inválido' },
        { status: 400 }
      );
    }

    const entries = await db
      .select({
        id: painEntries.id,
        bodyPart: painEntries.bodyPart,
        painLevel: painEntries.painLevel,
        createdAt: painEntries.createdAt,
        treatmentForm: {
          formData: treatmentForms.formData,
        },
      })
      .from(painEntries)
      .leftJoin(treatmentForms, eq(painEntries.id, treatmentForms.painEntryId))
      .where(eq(painEntries.userId, userId))
      .orderBy(desc(painEntries.createdAt));

    const formattedEntries = entries.map(entry => ({
      ...entry,
      treatmentForm: entry.treatmentForm?.formData 
        ? { formData: JSON.parse(entry.treatmentForm.formData as string) }
        : null,
    }));

    return NextResponse.json({ entries: formattedEntries });
  } catch (error) {
    console.error('Get pain entries error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
