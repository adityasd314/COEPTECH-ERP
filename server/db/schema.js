const { pgTable, pgEnum, serial, integer, time, varchar, text, date, foreignKey, timestamp, uniqueIndex, index, unique, boolean }  = require("drizzle-orm/pg-core")
  const { sql }  = require("drizzle-orm")

const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
const factorType = pgEnum("factor_type", ['totp', 'webauthn'])
const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])
const equalityOp = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])
const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
const bookingStatus = pgEnum("booking_status", ['withdrawn', 'cancelled', 'confirmed', 'pending'])
const documentStatus = pgEnum("document_status", ['withdrawn', 'rejected', 'approved', 'pending'])
const roles = pgEnum("roles", ['student', 'teacher', 'admin', 'hod'])
const lectureStatus = pgEnum("lecture_status", ['UPCOMING', 'CONDUCTED', 'CANCELLED'])
const dayOfWeekEnum = pgEnum("day_of_week_enum", ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])


const timetable = pgTable("timetable", {
	timetableId: serial("timetable_id").primaryKey().notNull(),
	departmentId: integer("department_id"),
	dayOfWeek: dayOfWeekEnum("day_of_week"),
	startTime: time("start_time"),
	endTime: time("end_time"),
	courseId: integer("course_id"),
	professorId: integer("professor_id"),
	location: varchar("location", { length: 255 }),
	duration: integer("duration"),
});

const performanceMetrics = pgTable("performance_metrics", {
	metricId: serial("metric_id").primaryKey().notNull(),
	metricName: varchar("metric_name", { length: 255 }),
	description: text("description"),
});

const reports = pgTable("reports", {
	reportId: serial("report_id").primaryKey().notNull(),
	reportName: varchar("report_name", { length: 255 }).notNull(),
	reportDate: date("report_date"),
	reportType: varchar("report_type", { length: 100 }),
	generatedBy: varchar("generated_by", { length: 255 }),
	cloudinaryLink: varchar("cloudinary_link", { length: 255 }),
});

const tutorials = pgTable("tutorials", {
	tutorialId: serial("tutorial_id").primaryKey().notNull(),
	courseId: integer("course_id").references(() => courses.courseId),
	professorId: integer("professor_id").references(() => professors.professorId),
	dateTime: timestamp("date_time", { precision: 6, mode: 'string' }),
	location: varchar("location", { length: 255 }),
	duration: integer("duration"),
	state: lectureStatus("state").default('UPCOMING').notNull(),
});

const venues = pgTable("venues", {
	venueId: serial("venue_id").primaryKey().notNull(),
	venueName: varchar("venue_name", { length: 255 }).notNull(),
	description: text("description"),
	capacity: integer("capacity"),
	location: varchar("location", { length: 255 }),
	permissionFacultyId: integer("permission_faculty_id").references(() => professors.professorId),
});

const users = pgTable("users", {
	userId: serial("user_id").primaryKey().notNull(),
	email: varchar("email", { length: 255 }),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	role: roles("role"),
},
(table) => {
	return {
		emailKey: uniqueIndex("users_email_key").on(table.email),
	}
});

const userRole = pgTable("user_role", {
	userId: serial("user_id").primaryKey().notNull(),
	roleId: varchar("role_id"),
});

const accountAdmins = pgTable("account_admins", {
	adminId: serial("admin_id").primaryKey().notNull(),
	userId: integer("user_id").notNull().references(() => users.userId),
},
(table) => {
	return {
		userIdKey: uniqueIndex("account_admins_user_id_key").on(table.userId),
	}
});

const professors = pgTable("professors", {
	professorId: serial("professor_id").primaryKey().notNull(),
	name: varchar("name", { length: 100 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	departmentId: integer("department_id").references(() => departments.departmentId),
	position: varchar("position", { length: 100 }),
	userId: integer("user_id").references(() => users.userId),
});

const bookings = pgTable("bookings", {
	bookingId: serial("booking_id").primaryKey().notNull(),
	professorId: integer("professor_id").references(() => professors.professorId),
	venueId: integer("venue_id").references(() => venues.venueId),
	bookingDate: date("booking_date"),
	startTime: time("start_time"),
	endTime: time("end_time"),
	purpose: text("purpose"),
	status: bookingStatus("status").default('pending'),
});

const events = pgTable("events", {
	eventId: serial("event_id").primaryKey().notNull(),
	eventName: varchar("event_name", { length: 255 }).notNull(),
	startDate: timestamp("start_date", { precision: 6, mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { precision: 6, mode: 'string' }).notNull(),
	description: text("description"),
	createdByUserId: integer("created_by_user_id").notNull().references(() => users.userId),
},
(table) => {
	return {
		idxEventsCreatedByUserId: index("idx_events_created_by_user_id").on(table.createdByUserId),
	}
});

const headsOfDepartment = pgTable("heads_of_department", {
	hodId: serial("hod_id").primaryKey().notNull(),
	name: varchar("name", { length: 100 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	userId: integer("user_id").references(() => users.userId),
});

const students = pgTable("students", {
	studentId: serial("student_id").primaryKey().notNull(),
	mis: varchar("mis", { length: 50 }).notNull(),
	departmentId: integer("department_id"),
	year: integer("year"),
	userId: integer("user_id").references(() => users.userId),
},
(table) => {
	return {
		misKey: uniqueIndex("students_mis_key").on(table.mis),
	}
});

const submittedDocuments = pgTable("submitted_documents", {
	submissionId: serial("submission_id").primaryKey().notNull(),
	eventId: integer("event_id").notNull().references(() => events.eventId),
	userId: integer("user_id").notNull().references(() => users.userId),
	documentTypeId: integer("document_type_id").notNull().references(() => documentTypes.documentId),
	documentUrl: varchar("document_url", { length: 512 }).notNull(),
	submissionDate: timestamp("submission_date", { precision: 6, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		idxSubmittedDocumentsDocumentTypeId: index("idx_submitted_documents_document_type_id").on(table.documentTypeId),
		idxSubmittedDocumentsEventId: index("idx_submitted_documents_event_id").on(table.eventId),
		idxSubmittedDocumentsUserId: index("idx_submitted_documents_user_id").on(table.userId),
	}
});

const uploadedDocuments = pgTable("uploaded_documents", {
	documentId: serial("document_id").primaryKey().notNull(),
	documentTypeId: integer("document_type_id").notNull().references(() => documentTypes.documentId),
	documentName: varchar("document_name", { length: 255 }).notNull(),
	uploadDate: timestamp("upload_date", { precision: 6, mode: 'string' }).defaultNow(),
	documentUrl: varchar("document_url", { length: 512 }).notNull(),
	uploadedByUserId: integer("uploaded_by_user_id").notNull().references(() => users.userId),
},
(table) => {
	return {
		idxUploadedDocumentsDocumentTypeId: index("idx_uploaded_documents_document_type_id").on(table.documentTypeId),
	}
});

const courses = pgTable("courses", {
	courseId: serial("course_id").primaryKey().notNull(),
	courseName: varchar("course_name", { length: 255 }).notNull(),
	courseCode: varchar("course_code", { length: 50 }).notNull(),
	departmentId: integer("department_id").references(() => departments.departmentId),
	professorId: integer("professor_id").references(() => professors.professorId),
});

const departments = pgTable("departments", {
	departmentId: serial("department_id").primaryKey().notNull(),
	departmentName: varchar("department_name", { length: 100 }).notNull(),
	headOfDepartmentId: integer("head_of_department_id").references(() => headsOfDepartment.hodId),
},
(table) => {
	return {
		departmentsDepartmentIdKey: unique("departments_department_id_key").on(table.departmentId),
	}
});

const documentTypes = pgTable("document_types", {
	documentId: serial("document_id").primaryKey().notNull(),
	documentName: varchar("document_name", { length: 255 }).notNull(),
},
(table) => {
	return {
		documentNameKey: uniqueIndex("document_types_document_name_key").on(table.documentName),
		idxDocumentTypesDocumentName: index("idx_document_types_document_name").on(table.documentName),
	}
});

const documents = pgTable("documents", {
	documentId: serial("document_id").primaryKey().notNull(),
	documentName: varchar("document_name", { length: 255 }).notNull(),
	uploaderId: integer("uploader_id").references(() => professors.professorId),
	uploadDate: timestamp("upload_date", { precision: 6, mode: 'string' }).defaultNow(),
	venueId: integer("venue_id").references(() => venues.venueId),
	cloudinaryLink: varchar("cloudinary_link", { length: 255 }),
	status: documentStatus("status").default('pending'),
});

const eventDocuments = pgTable("event_documents", {
	eventDocumentId: serial("event_document_id").primaryKey().notNull(),
	eventId: integer("event_id").notNull().references(() => events.eventId),
	documentTypeId: integer("document_type_id").notNull().references(() => documentTypes.documentId),
},
(table) => {
	return {
		idxEventDocumentsDocumentTypeId: index("idx_event_documents_document_type_id").on(table.documentTypeId),
		idxEventDocumentsEventId: index("idx_event_documents_event_id").on(table.eventId),
	}
});

const facultyVenuePermissions = pgTable("faculty_venue_permissions", {
	permissionId: serial("permission_id").primaryKey().notNull(),
	facultyId: integer("faculty_id").references(() => professors.professorId),
	venueId: integer("venue_id").references(() => venues.venueId),
	permissionRequired: boolean("permission_required").default(true),
});

const feedback = pgTable("feedback", {
	feedbackId: serial("feedback_id").primaryKey().notNull(),
	studentId: integer("student_id").references(() => students.studentId),
	sessionType: varchar("session_type", { length: 20 }),
	sessionId: integer("session_id"),
	feedbackText: text("feedback_text"),
	rating: integer("rating"),
	dateTime: timestamp("date_time", { precision: 6, mode: 'string' }),
	departmentId: integer("department_id").references(() => departments.departmentId),
	professorId: integer("professor_id").references(() => professors.professorId),
	courseId: integer("course_id").references(() => courses.courseId),
});

const lectures = pgTable("lectures", {
	lectureId: serial("lecture_id").primaryKey().notNull(),
	courseId: integer("course_id").references(() => courses.courseId),
	professorId: integer("professor_id").references(() => professors.professorId),
	dateTime: timestamp("date_time", { precision: 6, mode: 'string' }),
	location: varchar("location", { length: 255 }),
	duration: integer("duration"),
	state: lectureStatus("state").default('UPCOMING').notNull(),
});

const observationChecklist = pgTable("observation_checklist", {
	checklistId: serial("checklist_id").primaryKey().notNull(),
	checklistName: varchar("checklist_name", { length: 255 }),
	description: text("description"),
	departmentId: integer("department_id").references(() => departments.departmentId),
	facultyId: integer("faculty_id").references(() => professors.professorId),
});

const practicals = pgTable("practicals", {
	practicalId: serial("practical_id").primaryKey().notNull(),
	courseId: integer("course_id").references(() => courses.courseId),
	professorId: integer("professor_id").references(() => professors.professorId),
	dateTime: timestamp("date_time", { precision: 6, mode: 'string' }),
	location: varchar("location", { length: 255 }),
	duration: integer("duration"),
	state: lectureStatus("state").default('UPCOMING').notNull(),
});

module.exports = {
	timetable,
	performanceMetrics,
	reports,
	tutorials,
	venues,
	users,
	userRole,
	accountAdmins,
	professors,
	bookings,
	events,
	headsOfDepartment,
	students,
	submittedDocuments,
	uploadedDocuments,
	courses,
	departments,
	documentTypes,
	documents,
	eventDocuments,
	facultyVenuePermissions,
	feedback,
	lectures,
	observationChecklist,
	practicals,
	keyStatus,
	keyType,
	factorType,
	factorStatus,
	aalLevel,
	codeChallengeMethod,
	equalityOp,
	action,
	roles,
	lectureStatus,
	dayOfWeekEnum,
	bookingStatus,
	documentStatus
};