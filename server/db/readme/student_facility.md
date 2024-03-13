[Student Facility](https://drawsql.app/teams/coep-erp/diagrams/studentfacilitywithglobal)
========================

This database contains tables related to user management, document storage, event management, and document submission tracking.

Tables:
-------

### `roles`

-   Stores different roles that users can have.
-   Fields:
    -   `role_id`: Primary key, unique identifier for each role.
    -   `role_name`: Name of the role.

### `users`

-   Stores user information.
-   Fields:
    -   `user_id`: Primary key, unique identifier for each user.
    -   `email`: Email address of the user, unique.
    -   `mis`: Management Information System (MIS) number of the user, unique.
    -   `password_hash`: Hashed password of the user.
    -   `role_id`: Foreign key referencing the `role_id` in the `roles` table.

### `user_role`

-   Stores the relationship between users and roles.
-   Fields:
    -   `user_id`: Foreign key referencing the `user_id` in the `users` table.
    -   `role_id`: Foreign key referencing the `role_id` in the `roles` table.

### `document_types`

-   Stores different types of documents.
-   Fields:
    -   `document_id`: Primary key, unique identifier for each document type.
    -   `document_name`: Name of the document type, unique.

### `uploaded_documents`

-   Stores documents uploaded by users.
-   Fields:
    -   `document_id`: Primary key, unique identifier for each uploaded document.
    -   `document_type_id`: Foreign key referencing the `document_id` in the `document_types` table.
    -   `document_name`: Name of the uploaded document.
    -   `upload_date`: Timestamp indicating the upload date and time.
    -   `document_url`: URL of the uploaded document.
    -   `uploaded_by_user_id`: Foreign key referencing the `user_id` in the `users` table.

### `account_admins`

-   Stores users with administrative privileges for account management.
-   Fields:
    -   `admin_id`: Primary key, unique identifier for each admin.
    -   `user_id`: Foreign key referencing the `user_id` in the `users` table.

### `events`

-   Stores information about events, such as document collection drives.
-   Fields:
    -   `event_id`: Primary key, unique identifier for each event.
    -   `event_name`: Name of the event.
    -   `start_date`: Timestamp indicating the start date and time of the event.
    -   `end_date`: Timestamp indicating the end date and time of the event.
    -   `description`: Description of the event.
    -   `created_by_user_id`: Foreign key referencing the `user_id` in the `users` table.

### `event_documents`

-   Stores the relationship between events and required document types.
-   Fields:
    -   `event_document_id`: Primary key, unique identifier for each event document.
    -   `event_id`: Foreign key referencing the `event_id` in the `events` table.
    -   `document_type_id`: Foreign key referencing the `document_id` in the `document_types` table.

### `submitted_documents`

-   Stores documents submitted by users for events.
-   Fields:
    -   `submission_id`: Primary key, unique identifier for each submitted document.
    -   `event_id`: Foreign key referencing the `event_id` in the `events` table.
    -   `user_id`: Foreign key referencing the `user_id` in the `users` table.
    -   `document_type_id`: Foreign key referencing the `document_id` in the `document_types` table.
    -   `document_url`: URL of the submitted document.
    -   `submission_date`: Timestamp indicating the submission date and time.

Indexes:
--------

Indexes have been created on frequently queried columns to improve query performance.

-   `idx_events_created_by_user_id` on `events` table.
-   `idx_document_types_document_name` on `document_types` table.
-   `idx_event_documents_event_id` and `idx_event_documents_document_type_id` on `event_documents` table.
-   `idx_submitted_documents_event_id`, `idx_submitted_documents_user_id`, and `idx_submitted_documents_document_type_id` on `submitted_documents` table.
-   `idx_uploaded_documents_document_type_id` on `uploaded_documents` table.

* * * * *

Feel free to modify this README file as needed for your project documentation. Let me know if you need further assistance!