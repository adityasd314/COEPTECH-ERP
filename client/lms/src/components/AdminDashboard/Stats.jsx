import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Input,
  Select,
} from '@chakra-ui/react';
import { useState } from 'react';
import DetailedStats from './AttendanceCalendar';

const Stats = () => {
  const employees = ["employee1", "employee2", "employee3", "employee4", "employee5"];
  const months_arr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [searchEmployee, setSearchEmployee] = useState("");
  const [detail,setDetailed] = useState(false)
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchEmployee(searchTerm);
    if (searchTerm === "") {
      setFilteredEmployees(employees);
    } else {
      const results = employees.filter((name) =>
        name.toLowerCase().includes(searchTerm)
      );
      setFilteredEmployees(results);
    }
  };

  return (
    detail?(
    <DetailedStats />):
    (<TableContainer>
      <div className="util">
        <div className="search-bar">
          <Input
            placeholder='Search Employee'
            value={searchEmployee}
            onChange={handleSearchChange}
          />
        </div>
        <div className='selector'>
          <Select defaultValue="January">
            {months_arr.map((month) => (
              <option key={month}>{month}</option>
            ))}
          </Select>
        </div>
      </div>
      <Table variant='simple' colorScheme='red'>
        <Thead>
          <Tr>
            <Th>Employee</Th>
            <Th>Leave</Th>
            <Th>Attendance</Th>
            <Th>Details</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredEmployees.map((employee) => (
            <Tr key={employee}>
              <Td>{employee}</Td>
              <Td>15%</Td>
              <Td>85%</Td>
              <Td>
                  <Button className='button' onClick={()=>setDetailed(true)}>Detail</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>)
  );
};

export default Stats;
