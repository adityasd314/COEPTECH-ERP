[Venue Management System Database Tables README](https://drawsql.app/teams/coep-erp/diagrams/venues)
==============================================


Introduction
------------

This README provides an overview of the database tables related to venue management in the Venue Management System.

Tables
------

### 1\. Venues Table

-   Table Name: venues
-   Description: Stores information about venues available for booking.
-   Fields:
    -   venue_id (Primary Key): Unique identifier for each venue.
    -   venue_name: Name of the venue.
    -   description: Description of the venue.
    -   capacity: Maximum capacity of the venue.
    -   location: Location of the venue.
    -   permission_faculty_id: ID of the faculty member responsible for granting permissions for booking the venue.

### 2\. Faculty_Venue_Permissions Table

-   Table Name: faculty_venue_permissions
-   Description: Establishes permissions for faculty members to grant booking permissions for specific venues.
-   Fields:
    -   permission_id (Primary Key): Unique identifier for each permission.
    -   faculty_id: ID of the faculty member.
    -   venue_id: ID of the venue for which permissions are granted.
    -   permission_required: Indicates whether permission is required from the faculty member for booking the venue.

### 3\. Bookings Table

-   Table Name: bookings
-   Description: Tracks bookings made for each venue.
-   Fields:
    -   booking_id (Primary Key): Unique identifier for each booking.
    -   professor_id: ID of the professor making the booking.
    -   venue_id: ID of the venue booked.
    -   booking_date: Date of the booking.
    -   start_time: Start time of the booking.
    -   end_time: End time of the booking.
    -   purpose: Purpose of the booking.
    -   status: Status of the booking (e.g., pending, confirmed, cancelled).

### 4\. Reports Table

-   Table Name: reports
-   Description: Stores information about generated reports on venue usage.
-   Fields:
    -   report_id (Primary Key): Unique identifier for each report.
    -   report_name: Name of the report.
    -   report_date: Date when the report was generated.
    -   report_type: Type of the report.
    -   generated_by: Name of the entity that generated the report.
    -   cloudinary_link: Link to the PDF report stored in Cloudinary.