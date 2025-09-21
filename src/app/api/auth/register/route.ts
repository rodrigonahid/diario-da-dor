import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByPhone } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, phone } = await request.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByPhone(phone);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já existe com este telefone' },
        { status: 409 }
      );
    }

    const user = await createUser(name, phone);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
