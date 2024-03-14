import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select } from '@chakra-ui/react';
import EmployeeAttendanceStatus from '../EmployeeDashboard/EmployeeAttendanceStatus';
import { useAuthContext } from "../../hooks/useAuthContext";
import { backendURL } from '../../config/config';

const AttendanceCalendar = () => {

  const { user } = useAuthContext();

  const [employees, setEmployees] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const getEmployeeData = async () => {
      try {
        if (user && user._id) {

          const managerId = user._id;
          const response = await axios.post(backendURL + '/admin/getAllEmployees', { managerId })
          setEmployees(response.data);
        } else {
          console.error("Manager id not found or null");
        }
       
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getEmployeeData();
  }, []);

  const handleEmployeeSelect = (event) => {
    const selectedEmployee = event.target.value;
    setSelectedOption(selectedEmployee);
  }

  const options = employees.map((employee) => ({
    value: employee._id,
    label: employee.info.name,
  }));

  return (
    <div>
      <div className='flex-wrap w-64'>
      <Select
        placeholder={"Select Employee"}
        onChange={handleEmployeeSelect}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      </div>
      {selectedOption && (
        <EmployeeAttendanceStatus isAdmin={true} employeeId={selectedOption} isActive={1} />
      )}
    </div>
  );
};

export default AttendanceCalendar;
