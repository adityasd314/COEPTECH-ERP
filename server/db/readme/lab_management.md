[LAB MANAGEMENT SYSTEM README](https://drawsql.app/teams/coep-erp/diagrams/lab)
==============================================================

Introduction
------------

This README provides an overview of the database tables related to student and professor management in the Student and Professor Management System.

Tables
------

### 1\. Students Table

-   Table Name: students
-   Description: Stores information about students enrolled in the institution.
-   Fields:
    -   student_id (Primary Key): Unique identifier for each student.
    -   mis: Management Information System (MIS) number of the student (unique).
    -   department_id: ID of the department to which the student belongs.
    -   year: Year of enrollment.
    -   user_id: ID referencing the user details of the student (foreign key).

### 2\. Professors Table

-   Table Name: professors
-   Description: Stores information about professors teaching in the institution.
-   Fields:
    -   professor_id (Primary Key): Unique identifier for each professor.
    -   name: Name of the professor.
    -   email: Email address of the professor.
    -   department: Department to which the professor belongs.
    -   position: Position/title of the professor.

### 3\. Courses Table

-   Table Name: courses
-   Description: Stores information about courses offered by the institution.
-   Fields:
    -   course_id (Primary Key): Unique identifier for each course.
    -   course_name: Name of the course.
    -   course_code: Code/identifier of the course.
    -   department_id: ID of the department offering the course (foreign key).

### 4\. Lectures, Practicals, and Tutorials Tables

-   Table Names: lectures, practicals, tutorials
-   Description: Store information about different types of sessions conducted for courses.
-   Fields (common to all):
    -   session_id (Primary Key): Unique identifier for each session.
    -   course_id: ID of the course for which the session is conducted.
    -   professor_id: ID of the professor conducting the session (foreign key).
    -   date_time: Date and time of the session.
    -   location: Location where the session is conducted.
    -   duration: Duration of the session.

### 5\. Feedback Table

-   Table Name: feedback
-   Description: Stores feedback provided by students for various sessions.
-   Fields:
    -   feedback_id (Primary Key): Unique identifier for each feedback entry.
    -   student_id: ID of the student providing the feedback (foreign key).
    -   session_type: Type of session (lecture, practical, tutorial).
    -   session_id: ID of the session for which feedback is provided.
    -   feedback_text: Textual feedback provided by the student.
    -   rating: Numeric rating provided by the student.
    -   date_time: Date and time when the feedback is provided.
    -   department_id: ID of the department to which the student belongs (foreign key).

### 6\. Observation Checklist Table

-   Table Name: observation_checklist
-   Description: Stores observation checklists created by faculty members.
-   Fields:
    -   checklist_id (Primary Key): Unique identifier for each checklist entry.
    -   checklist_name: Name/identifier of the checklist.
    -   description: Description of the checklist.
    -   department_id: ID of the department to which the checklist is associated (foreign key).
    -   faculty_id: ID of the faculty member associated with the checklist (foreign key).

### 7\. Performance Metrics Table

-   Table Name: performance_metrics
-   Description: Stores information about performance metrics used for evaluation.
-   Fields:
    -   metric_id (Primary Key): Unique identifier for each performance metric.
    -   metric_name: Name/identifier of the performance metric.
    -   description: Description of the performance metric.

### 8\. Heads of Department Table

-   Table Name: heads_of_department
-   Description: Stores information about heads of departments.
-   Fields:
    -   hod_id (Primary Key): Unique identifier for each head of department.
    -   name: Name of the head of department.
    -   email: Email address of the head of department.
    -   department_id: ID of the department to which the head belongs (foreign key).

### 9\. Departments Table

-   Table Name: departments
-   Description: Stores information about departments in the institution.
-   Fields:
    -   department_id (Primary Key): Unique identifier for each department.
    -   department_name: Name of the department.
    -   head_of_department_id: ID of the head of department (foreign key).