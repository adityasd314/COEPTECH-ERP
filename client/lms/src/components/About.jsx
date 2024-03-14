import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { backendURL } from "../config/config";

const About = () => {

  const [rules, setRules] = useState([]);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get(backendURL + "/rule/get");
        setRules(response.data);
      } catch (error) {
        console.error("Error fetching rules:", error.message);
      }
    };

    fetchRules();
  }, []);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md md:max-w-xl lg:max-w-2xl">
        <h1 className="text-3xl font-semibold mb-4">
          ARA Attendance - Leave Policy
        </h1>

        <p className="text-gray-700 mb-4">
          Welcome to the official ARA Attendance and Leave Management System's Leave Policy page. This policy outlines the conditions for awarding entitled leave and its usage.
        </p>

        {/* <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Entitled Leave Conditions:</h2>
          <ul className="list-disc pl-4">
            <li>If an employee attends for more than 22 days, they are granted 2 entitled leaves.</li>
            <li>If an employee attends for 12 to 22 days, they are granted 1 entitled leave.</li>
            <li>If an employee attends for fewer than 12 days, they are not awarded entitled leave.</li>
          </ul>

          <p className="mt-4">
            Entitled leave is a valuable benefit as it allows employees to take paid leave, providing them with the flexibility to balance work and personal commitments.
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">New Employee Entitled Leave:</h2>
          <p className="mt-4">
            Newly joined employees, during their probation period, are not eligible to use entitled leave. However, entitlement accumulates during this period.
          </p>
        </div>

        <p className="text-gray-700">
          This policy aims to provide fair and transparent guidelines regarding entitled leave, encouraging a healthy work-life balance for all employees.
        </p> */}

        <div id="recievedData">
          <ul className="list-disc pl-4">
            {rules.map((rule) => (
              <>
              <li key={rule._id} className="text-lg mb-4" style={{ listStyle: 'none' }}>
                <strong>{rule.title}    :</strong>{" "}
                <span dangerouslySetInnerHTML={{ __html: rule.content }} />
              </li>
              <br />
              </>
              
            ))}
          </ul>
          
        </div>
      </div>
    </div>
  );
};

export default About;