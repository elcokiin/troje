import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
})

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    provider_account_id: text("provider_account_id").notNull(),
    access_token: text("access_token"),
    refresh_token: text("refresh_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
  },
  (table) => [
    index("idx_accounts_user_id").on(table.user_id),
    uniqueIndex("idx_accounts_provider_account").on(table.provider, table.provider_account_id),
  ]
)

export const ideas = pgTable(
  "ideas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    source: text("source").default("web").$type<"web" | "telegram" | "api">(),
    status: text("status").default("inbox").$type<"inbox" | "archived" | "deleted">(),
    tags: text("tags").array(),
    pinned: boolean("pinned").default(false),
    background_color: text("background_color"),
    deleted_at: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
  },
  (table) => [
    index("idx_ideas_user_status_created").on(table.user_id, table.status, table.created_at),
  ]
)

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    key_hash: text("key_hash").notNull().unique(),
    key_preview: text("key_preview").notNull(),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow(),
    last_used_at: timestamp("last_used_at", { withTimezone: true, mode: "string" }),
  },
  (table) => [
    index("idx_api_keys_user_id").on(table.user_id),
    index("idx_api_keys_key_hash").on(table.key_hash),
  ]
)

export type Idea = typeof ideas.$inferSelect
export type NewIdea = typeof ideas.$inferInsert
export type ApiKey = typeof apiKeys.$inferSelect
