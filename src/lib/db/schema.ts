import { pgTable, text, serial, integer, timestamp, json } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const painEntries = pgTable('pain_entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  bodyPart: text('body_part').notNull(),
  painLevel: integer('pain_level').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const treatmentForms = pgTable('treatment_forms', {
  id: serial('id').primaryKey(),
  painEntryId: integer('pain_entry_id').notNull().references(() => painEntries.id, { onDelete: 'cascade' }),
  formData: json('form_data').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PainEntry = typeof painEntries.$inferSelect;
export type NewPainEntry = typeof painEntries.$inferInsert;
export type TreatmentForm = typeof treatmentForms.$inferSelect;
export type NewTreatmentForm = typeof treatmentForms.$inferInsert;