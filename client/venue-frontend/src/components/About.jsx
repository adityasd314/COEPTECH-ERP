import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendURL } from "../config/config";

const VenueBookingPolicy = () => {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get(backendURL + "/venue_policy/get");
        setRules(response.data);
      } catch (error) {
        console.error("Error fetching venue booking policy:", error.message);
      }
    };

    fetchRules();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md md:max-w-xl lg:max-w-2xl">
        <h1 className="text-3xl font-semibold mb-4">
          Venue Booking Policy
        </h1>

        <p className="text-gray-700 mb-4">
          Welcome to the official Venue Booking Policy page of our system. This policy outlines the guidelines and conditions for booking venues.
        </p>

        <div id="recievedData">
          <ul className="list-disc pl-4">
            {rules.map((rule) => (
              <li key={rule._id} className="text-lg mb-4">
                <strong>{rule.title}:</strong>{" "}
                <span dangerouslySetInnerHTML={{ __html: rule.content }} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VenueBookingPolicy;
