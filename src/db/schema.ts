import { pgTable, serial, varchar, integer, boolean, text, numeric, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';

// ============================================
// CORE TABLES
// ============================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  keycloakId: varchar('keycloak_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const cards = pgTable('cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }),
  bio: text('bio'),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  website: varchar('website', { length: 500 }),
  profilePicture: varchar('profile_picture', { length: 500 }),
  bannerImage: varchar('banner_image', { length: 500 }),
  logoImage: varchar('logo_image', { length: 500 }),
  socialLinks: jsonb('social_links'), // {linkedin, twitter, github, etc}
  payLinks: jsonb('pay_links'), // {upi, razorpay, dodopayments}
  customFields: jsonb('custom_fields'),
  theme: jsonb('theme'), // {primaryColor, secondaryColor, font, layout}
  isActive: boolean('is_active').default(true),
  qrCodeUrl: varchar('qr_code_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  sourceCardId: uuid('source_card_id').references(() => cards.id),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  company: varchar('company', { length: 255 }),
  jobTitle: varchar('job_title', { length: 255 }),
  notes: text('notes'),
  tags: jsonb('tags'), // array of strings
  customFields: jsonb('custom_fields'),
  lastContactedAt: timestamp('last_contacted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const contactEnrichments = pgTable('contact_enrichments', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  linkedinUrl: varchar('linkedin_url', { length: 500 }),
  linkedinSummary: text('linkedin_summary'),
  skills: jsonb('skills'), // array of strings
  seniority: varchar('seniority', { length: 100 }),
  companySize: varchar('company_size', { length: 100 }),
  companyFunding: varchar('company_funding', { length: 255 }),
  industry: varchar('industry', { length: 255 }),
  leadScore: integer('lead_score').default(0), // 0-100
  aiSummary: text('ai_summary'),
  enrichedAt: timestamp('enriched_at').defaultNow().notNull(),
});

export const contactCategories = pgTable('contact_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  category: varchar('category', { length: 100 }).notNull(), // Lead, Client, Recruiter, Investor, etc.
  confidence: numeric('confidence', { precision: 3, scale: 2 }), // 0.00-1.00
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const followUps = pgTable('follow_ups', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // email, linkedin, whatsapp
  subject: varchar('subject', { length: 500 }),
  content: text('content').notNull(),
  suggestedTiming: varchar('suggested_timing', { length: 50 }), // 1day, 3days, 1week
  status: varchar('status', { length: 50 }).default('pending'), // pending, sent, replied
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cardScans = pgTable('card_scans', {
  id: uuid('id').primaryKey().defaultRandom(),
  cardId: uuid('card_id').references(() => cards.id).notNull(),
  contactId: uuid('contact_id').references(() => contacts.id),
  deviceType: varchar('device_type', { length: 50 }),
  browser: varchar('browser', { length: 100 }),
  referrer: varchar('referrer', { length: 500 }),
  ipAddress: varchar('ip_address', { length: 50 }),
  geolocation: jsonb('geolocation'), // {country, city, lat, lng}
  dayOfWeek: integer('day_of_week'), // 0-6
  hourOfDay: integer('hour_of_day'), // 0-23
  scannedAt: timestamp('scanned_at').defaultNow().notNull(),
});

export const integrations = pgTable('integrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 100 }).notNull(), // google_contacts, notion, google_calendar, microsoft_calendar
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  metadata: jsonb('metadata'), // provider-specific data
  isActive: boolean('is_active').default(true),
  lastSyncAt: timestamp('last_sync_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  plan: varchar('plan', { length: 50 }).notNull(), // starter, pro, team, business
  status: varchar('status', { length: 50 }).notNull(), // trial, active, cancelled, expired
  dodopaymentSubscriptionId: varchar('dodopayment_subscription_id', { length: 255 }),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  trialEndsAt: timestamp('trial_ends_at'),
  cancelledAt: timestamp('cancelled_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  date: timestamp('date').notNull(),
  location: varchar('location', { length: 500 }),
  description: text('description'),
  qrCodeUrl: varchar('qr_code_url', { length: 500 }),
  calendarEventId: varchar('calendar_event_id', { length: 255 }),
  calendarType: varchar('calendar_type', { length: 50 }), // google, microsoft
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const calendarSyncs = pgTable('calendar_syncs', {
  id: uuid('id').primaryKey().defaultRandom(),
  integrationId: uuid('integration_id').references(() => integrations.id).notNull(),
  lastSyncTime: timestamp('last_sync_time').notNull(),
  eventCount: integer('event_count').default(0),
  status: varchar('status', { length: 50 }).default('success'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const virtualBackgrounds = pgTable('virtual_backgrounds', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  cardId: uuid('card_id').references(() => cards.id),
  name: varchar('name', { length: 255 }).notNull(),
  backgroundImageUrl: varchar('background_image_url', { length: 500 }).notNull(),
  generatedImageUrl: varchar('generated_image_url', { length: 500 }),
  qrPosition: varchar('qr_position', { length: 50 }).default('top-center'), // top-left, top-center, top-right
  qrOffsetX: integer('qr_offset_x').default(0),
  qrOffsetY: integer('qr_offset_y').default(0),
  qrSize: varchar('qr_size', { length: 50 }).default('medium'),
  showContactInfo: boolean('show_contact_info').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// KILLER FEATURE TABLES
// ============================================

// Smart Introduction Engine
export const introductions = pgTable('introductions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  fromContactId: uuid('from_contact_id').references(() => contacts.id).notNull(),
  toContactId: uuid('to_contact_id').references(() => contacts.id).notNull(),
  reason: text('reason'),
  emailContent: text('email_content'),
  status: varchar('status', { length: 50 }).default('pending'), // pending, sent, connected, declined
  outcome: text('outcome'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const introductionSuggestions = pgTable('introduction_suggestions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  contact1Id: uuid('contact1_id').references(() => contacts.id).notNull(),
  contact2Id: uuid('contact2_id').references(() => contacts.id).notNull(),
  matchScore: numeric('match_score', { precision: 3, scale: 2 }), // 0.00-1.00
  reason: text('reason'),
  isDismissed: boolean('is_dismissed').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Revenue Tracking
export const deals = pgTable('deals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  sourceCardId: uuid('source_card_id').references(() => cards.id),
  title: varchar('title', { length: 255 }).notNull(),
  stage: varchar('stage', { length: 100 }).notNull(), // scan, meeting, proposal, deal, closed
  value: numeric('value', { precision: 12, scale: 2 }),
  probability: integer('probability').default(50), // 0-100
  closeDate: timestamp('close_date'),
  status: varchar('status', { length: 50 }).default('open'), // open, won, lost
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const dealStages = pgTable('deal_stages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  order: integer('order').notNull(),
  conversionRate: numeric('conversion_rate', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AI Email Sequences
export const emailSequences = pgTable('email_sequences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  triggerType: varchar('trigger_type', { length: 100 }), // card_scan, manual, etc
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const emailSequenceSteps = pgTable('email_sequence_steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  sequenceId: uuid('sequence_id').references(() => emailSequences.id).notNull(),
  stepNumber: integer('step_number').notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  bodyTemplate: text('body_template').notNull(),
  delayDays: integer('delay_days').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contactSequences = pgTable('contact_sequences', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  sequenceId: uuid('sequence_id').references(() => emailSequences.id).notNull(),
  currentStep: integer('current_step').default(0),
  status: varchar('status', { length: 50 }).default('active'), // active, paused, completed
  lastSentAt: timestamp('last_sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Live Card Updates
export const cardSubscriptions = pgTable('card_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  cardId: uuid('card_id').references(() => cards.id).notNull(),
  subscriberContactId: uuid('subscriber_contact_id').references(() => contacts.id).notNull(),
  notificationPreferences: jsonb('notification_preferences'),
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
});

export const cardUpdates = pgTable('card_updates', {
  id: uuid('id').primaryKey().defaultRandom(),
  cardId: uuid('card_id').references(() => cards.id).notNull(),
  updateType: varchar('update_type', { length: 100 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  metadata: jsonb('metadata'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Smart Meeting Scheduler
export const meetingTypes = pgTable('meeting_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  duration: integer('duration').notNull(), // in minutes
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  meetingTypeId: uuid('meeting_type_id').references(() => meetingTypes.id).notNull(),
  contactId: uuid('contact_id').references(() => contacts.id),
  scheduledTime: timestamp('scheduled_time').notNull(),
  agenda: text('agenda'),
  status: varchar('status', { length: 50 }).default('confirmed'), // confirmed, cancelled, completed
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Voice Note Follow-ups
export const voiceNotes = pgTable('voice_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  audioUrl: varchar('audio_url', { length: 500 }).notNull(),
  transcript: text('transcript'),
  duration: integer('duration'), // in seconds
  listenCount: integer('listen_count').default(0),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// LinkedIn Engagement
export const linkedinMonitoring = pgTable('linkedin_monitoring', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  linkedinUrl: varchar('linkedin_url', { length: 500 }).notNull(),
  lastCheckedAt: timestamp('last_checked_at'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const linkedinPosts = pgTable('linkedin_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  monitoringId: uuid('monitoring_id').references(() => linkedinMonitoring.id).notNull(),
  postUrl: varchar('post_url', { length: 500 }).notNull(),
  content: text('content'),
  postedAt: timestamp('posted_at').notNull(),
  engagementSuggested: boolean('engagement_suggested').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const suggestedComments = pgTable('suggested_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').references(() => linkedinPosts.id).notNull(),
  suggestedComment: text('suggested_comment').notNull(),
  isUsed: boolean('is_used').default(false),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Deal Rooms
export const dealRooms = pgTable('deal_rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const dealRoomContent = pgTable('deal_room_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  dealRoomId: uuid('deal_room_id').references(() => dealRooms.id).notNull(),
  type: varchar('type', { length: 100 }).notNull(), // proposal, pricing, case_study, video
  title: varchar('title', { length: 255 }).notNull(),
  contentUrl: varchar('content_url', { length: 500 }),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const dealRoomViews = pgTable('deal_room_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  dealRoomId: uuid('deal_room_id').references(() => dealRooms.id).notNull(),
  contentId: uuid('content_id').references(() => dealRoomContent.id),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
  duration: integer('duration'), // seconds spent viewing
  ipAddress: varchar('ip_address', { length: 50 }),
});

// Network Health Score
export const networkScores = pgTable('network_scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  score: integer('score').notNull(), // 0-100
  breakdownJson: jsonb('breakdown_json'), // detailed score breakdown
  calculationDate: timestamp('calculation_date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Group Cards
export const groupCards = pgTable('group_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description'),
  qrCodeUrl: varchar('qr_code_url', { length: 500 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const groupCardMembers = pgTable('group_card_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupCardId: uuid('group_card_id').references(() => groupCards.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: varchar('role', { length: 100 }), // CEO, CTO, Designer, etc
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Event Mode (Batch Scanning)
export const scanningEvents = pgTable('scanning_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  eventName: varchar('event_name', { length: 255 }).notNull(),
  eventDate: timestamp('event_date').notNull(),
  location: varchar('location', { length: 500 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const eventScans = pgTable('event_scans', {
  id: uuid('id').primaryKey().defaultRandom(),
  scanningEventId: uuid('scanning_event_id').references(() => scanningEvents.id).notNull(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  notes: text('notes'),
  photoUrl: varchar('photo_url', { length: 500 }),
  scannedAt: timestamp('scanned_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relationship Reminders
export const relationshipReminders = pgTable('relationship_reminders', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  lastContactDate: timestamp('last_contact_date'),
  reminderFrequency: integer('reminder_frequency').default(30), // days
  nextReminderDate: timestamp('next_reminder_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const contactTemperature = pgTable('contact_temperature', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  temperature: varchar('temperature', { length: 50 }).notNull(), // hot, warm, cold
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Anonymous Feedback
export const feedbackLinks = pgTable('feedback_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  question: text('question').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const anonymousFeedback = pgTable('anonymous_feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  feedbackLinkId: uuid('feedback_link_id').references(() => feedbackLinks.id).notNull(),
  content: text('content').notNull(),
  rating: integer('rating'), // 1-5
  ipHash: varchar('ip_hash', { length: 255 }),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

// Teams (for Business plan) - also serves as organizations
export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  industry: varchar('industry', { length: 255 }),
  websiteUrl: varchar('website_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const teamMembers = pgTable('team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').references(() => teams.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: varchar('role', { length: 50 }).default('member'), // owner, admin, member
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});
