import React from "react";

const HomePage = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white mt-12 p-8 rounded-lg shadow-md w-full max-w-md md:max-w-xl lg:max-w-2xl">
        <h1 className="text-3xl font-semibold mb-4">
          Welcome to the COEP's Attendance and Leave Management System
        </h1>

        <p className="text-gray-700 mb-4">
          Our system empowers you to efficiently manage attendance and leave records, providing a seamless experience for both employees and administrators.
        </p>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Admin/Manager Features:</h2>
          <ul className="list-disc pl-4">
            <li>Handle (Accept or Reject) Leave Applications for Each Employee: Manage and coordinate workforce availability by approving or rejecting leave requests.</li>
            <li>Check Leave History of Each Employee: Access detailed leave history for effective monitoring.</li>
            <li>Check Today's Attendance Status of Each Employee and Mark Attendance: Monitor real-time attendance and mark attendance for employees.</li>
            <li>View Employee Statistics: Access comprehensive statistics, including the number of leaves taken, monthly attendance, and accumulated leaves.</li>
            <li>View Detailed Attendance Stats in a Calendar: Visualize attendance in a calendar, indicating leave types for each day (paid, half-paid, unpaid).</li>
          </ul>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Employee Features:</h2>
          <ul className="list-disc pl-4">
            <li>Apply for Leave: Submit leave requests with start and end dates, along with reasons for the leave.</li>
            <li>Cancel Leave: Cancel leave requests before the leave date, offering flexibility for changes.</li>
            <li>Check Your Leave Status: View the status of current leave applications (approved, pending, or rejected).</li>
            <li>View Your Leave History: Access a complete history of past leave requests, including status and details.</li>
            <li>Check Your Attendance via an Inbuilt Calendar: Review monthly attendance with leave types (paid, half-paid, unpaid).</li>
            <li>Mark Attendance: Easily mark daily attendance, indicating presence or absence.</li>
          </ul>
        </div>

        <p className="text-gray-700">
          To get started, navigate to the respective sections for viewing attendance and managing leaves. Thank you for choosing our Attendance and Leave Management System!
        </p>
      </div>
    </div>
  );
};

export default HomePage;
