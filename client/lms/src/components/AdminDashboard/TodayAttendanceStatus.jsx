import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Select
} from '@chakra-ui/react';
import axios from "axios"
import MarkAttendance from '../EmployeeDashboard/MarkAttendance'
import { useAuthContext } from "../../hooks/useAuthContext";
import { backendURL } from '../../config/config';

const TodayAttendanceStatus = () => {
  const { user } = useAuthContext();
  const [searchEmployee, setSearchEmployee] = useState("");
  const [originalEmployees, setOriginalEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all', 'present', 'absent', 'halfDay'

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchEmployee(searchTerm);

    if (searchTerm === "") {
      setFilteredEmployees(originalEmployees);
    } else {
      const results = originalEmployees.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm)
      );
      setFilteredEmployees(results);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user._id) {
          const managerId = user._id;
          const response = await axios.post(backendURL + '/admin/getAllEmployees', { managerId });
          const users = response.data;
          const new_users_promise = users.map(async(user) => {  
            const response = await axios.get(backendURL + '/admin/attendance', {
              params: {
                _id: user._id
              }
            });
            

            const attendancedata = response.data;
            const res =  {
              _id: user._id,
              name: user.info.name,
              marker: attendancedata ? attendancedata.markerName : "Not Marked",
              value: attendancedata ? attendancedata.value : -1,
            };
            return res;
          });
        
          const new_users = await Promise.all(new_users_promise);
          setOriginalEmployees(new_users);
          setFilteredEmployees(new_users);
        } else {
          console.error("Manager id is null or undefined");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [user]);

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  return (
    <TableContainer>
      <div className="util" style={{ display: 'flex', gap: 30, width: '100%', marginBottom: '2%' }}>
        <div className="search-bar" style={{ display: 'flex', flexDirection: 'row', gap: 30, justifyContent: 'space-between', height: 'max-content', width: 560, }}>
          <Input
            placeholder='Search Employee'
            value={searchEmployee}
            onChange={handleSearchChange}
          />
          <Select value={filterType} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="present">Present</option>
            <option value="halfDay">Half Day</option>
            <option value="absent">Absent</option>
          </Select>
        </div>
      </div>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Employee</Th>
            <Th>Attendance</Th>
            <Th>Marker Name</Th>
            <Th>Mark Attendance</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredEmployees
            .filter(employee => {
              if (filterType === 'all') return true;
              if (filterType === 'present') return employee.value === 1;
              if (filterType === 'halfDay') return employee.value === 0.5;
              if (filterType === 'absent') return employee.value === 0;
              return true;
            })
            .map((employee) => (
              <Tr key={employee._id}>
                <Td>{employee.name}</Td>
                <Td>
                  <span style={{ color: employee.value === 1 ? 'green' : employee.value === 0.5 ? '#FFD700' : employee.value === 0 ? 'red' : 'black' }}>
                    {employee.value === 1 ? 'Present' : employee.value === 0.5 ? 'Half Day' : employee.value === 0 ? 'Absent' : 'Not Marked'}
                  </span>
                </Td>
                <Td>{employee.marker ? employee.marker : "Not Marked"}</Td>
                <Td><MarkAttendance employeeId={employee._id} /></Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TodayAttendanceStatus;
