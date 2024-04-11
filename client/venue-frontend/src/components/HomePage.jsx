import React from "react";

const HomePage = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white mt-12 p-8 rounded-lg shadow-md w-full max-w-md md:max-w-xl lg:max-w-2xl">
        <h1 className="text-3xl font-semibold mb-4">
          Welcome to the Venue Booking System
        </h1>

        <p className="text-gray-700 mb-4">
          Our system simplifies the process of booking venues, providing seamless access to main auditorium, mini auditorium, and the Cognizant lab for users.
        </p>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Admin Features:</h2>
          <ul className="list-disc pl-4">
            <li>Approve Booking Requests: Manage venue reservations by approving or rejecting bookings.</li>
            <li>Manage Venue Availability: Ensure accurate availability of venues for booking.</li>
            <li>Generate Reports: Access comprehensive reports for tracking venue usage and trends.</li>
          </ul>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">User Features:</h2>
          <ul className="list-disc pl-4">
            <li>View Venue Availability: Check the availability of specific venues for desired dates.</li>
            <li>Make Reservations: Easily book venues for events or activities.</li>
            <li>Cancel Bookings: Provide flexibility to cancel reservations when needed.</li>
          </ul>
        </div>

        <p className="text-gray-700">
          Get started by exploring the features for booking venues and managing reservations. Thank you for choosing our Venue Booking System!
        </p>
      </div>
    </div>
  );
};

export default HomePage;
