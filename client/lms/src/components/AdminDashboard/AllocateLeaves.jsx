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
} from "@chakra-ui/react";
import { backendURL } from "../../config/config";
import { useEffect, useState } from "react";
import axios from "axios";
import AllocateLeavesButton from "./AllocateLeavesButton";
import { useAuthContext } from "../../hooks/useAuthContext";

const AllocateLeaves = () => {
  const { user } = useAuthContext();
  const [searchEmployee, setSearchEmployee] = useState("");
  const [originalEmployees, setOriginalEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

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
          const response = await axios.post(
            backendURL + "/admin/getAllEmployees",
            { managerId }
          ).catch(error => {
            console.error("Error fetching attendance data:", error);
          });

          const users = response.data;
          const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
          const currentYear = new Date().getFullYear();
          const previousMonthIndex = new Date().getMonth() - 1;
          const previousMonthName = monthNames[previousMonthIndex < 0 ? 11 : previousMonthIndex];
          const previousYear = previousMonthIndex < 0 ? currentYear - 1 : currentYear;

          const processedUsers = await Promise.all(users.map(async(user) => {
            const response = await axios.get(backendURL+'/admin/attendancebyMY', {
              params: { _id: user._id, month: previousMonthName, year: previousYear }
            });
            const attendanceresponse = response.data;
            const attendance = attendanceresponse.reduce((val, entry) => val + entry.value, 0);
            const eligibleAL = attendance > 22 ? 2 : (attendance > 12 && attendance < 22 ? 1 : 0);
          
            const res = {
              name: user.info.name,
              attendance: attendance,
              eligibleAL: eligibleAL
            };
            return res;
          }));
          
          setOriginalEmployees(processedUsers);
          setFilteredEmployees(processedUsers)
          
        } else {
          console.error("Manager id is null or undefined");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <TableContainer>
      <div
        className="util"
        style={{ display: "flex", gap: 30, width: "100%", marginBottom: "2%" }}
      >
        <div
          className="search-bar"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 30,
            justifyContent: "space-between",
            height: "max-content",
            width: 560,
          }}
        >
          <Input
            placeholder="Search Employee"
            value={searchEmployee}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Employee</Th>
            <Th>Attendance (Previous Month)</Th>
            <Th>Eligible</Th>
            <Th>Allocate</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredEmployees.map((employee) => (
            <Tr key={employee._id}>
              <Td>{employee.name}</Td>
              <Td>{employee.attendance}</Td>
              <Td>{employee.eligibleAL}</Td>
              <Td>
                {employee.probation ? (
                  <h1 className="text-red-500">Probation Period</h1>
                ) : (
                  <>
                    {employee.set === false ? (
                      <AllocateLeavesButton employeeIds={[employee._id]} />
                    ) : (
                      <h1 className="text-green-600">Already Assigned</h1>
                    )}
                  </>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        Allocate to Everyone
        <AllocateLeavesButton
          employeeIds={originalEmployees
            .filter((employee) => !employee.set)
            .map((employee) => employee._id)}
        />{" "}
      </div>
    </TableContainer>
  );
};

export default AllocateLeaves;
