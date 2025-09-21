import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export async function createUser(name: string, phone: string) {
  const [user] = await db.insert(users).values({
    name,
    phone,
  }).returning();
  
  return user;
}

export async function getUserByPhone(phone: string) {
  const [user] = await db.select().from(users).where(eq(users.phone, phone));
  return user;
}

export async function authenticateUser(phone: string) {
  const user = await getUserByPhone(phone);
  return user;
}
