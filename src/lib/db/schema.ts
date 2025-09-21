import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const painEntries = sqliteTable('pain_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  bodyPart: text('body_part').notNull(),
  painLevel: integer('pain_level').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const treatmentForms = sqliteTable('treatment_forms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  painEntryId: integer('pain_entry_id').notNull().references(() => painEntries.id),
  formData: text('form_data', { mode: 'json' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PainEntry = typeof painEntries.$inferSelect;
export type NewPainEntry = typeof painEntries.$inferInsert;
export type TreatmentForm = typeof treatmentForms.$inferSelect;
export type NewTreatmentForm = typeof treatmentForms.$inferInsert;
