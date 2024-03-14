import { Table, Thead, Tbody, Tr, Th, Td, HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import RejectLeaveModal from "../RejectLeaveModal";
import AcceptLeaveModal from "../AcceptLeaveModal";
import { useAuthContext } from "../../hooks/useAuthContext";
import { backendURL } from "../../config/config";

const clearLeaveHandleData = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.includes("leavehandle")) {
      localStorage.removeItem(key);
      console.log(`Data with key ${key} cleared from localStorage`);
    }
  }
};

const HandleLeave = ({ refresh }) => {
  const { user } = useAuthContext();
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("handle Leave rendered")
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user._id) {
          const managerId = user._id;
          const storageKey = `leavehandle_${managerId}`;
          const cachedData = localStorage.getItem(storageKey);

          if (refresh) {
            localStorage.removeItem(storageKey); // Clear specific data from localStorage
            console.log(`Data with key ${storageKey} cleared from localStorage`);
            clearLeaveHandleData(); // Clear all localStorage data related to leave handling
          }

          const [leavesResponse, employeesResponse] = await Promise.all([
            axios.get(backendURL + '/admin/getAllLeaves'),
            axios.post(backendURL + '/admin/getAllEmployees', { managerId })
          ]);

          const leavesWithEmployeeNames = leavesResponse.data.map((leave) => {
            const matchingEmployee = employeesResponse.data.find(
              (employee) => employee._id === leave.employeeID 
            );

            return matchingEmployee ? { ...leave, employeeName: matchingEmployee.info.name } : null;
          }).filter(Boolean);

          const pendingLeaves = leavesWithEmployeeNames.filter(
            (leave) => leave.status === 'Pending'
          );

          setLeaveData(pendingLeaves);
          setLoading(false);

          // Save fetched data to localStorage
          localStorage.setItem(storageKey, JSON.stringify(pendingLeaves));
        } else {
          console.error("Manager id is null or undefined");
        }
      } catch (error) {
        console.error(
          'Error fetching data:',
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, [user, refresh]);

  return (
    <div className="overflow-x-auto">      
      {loading ? (
        <p>Loading...</p>
      ) : (
        leaveData.length === 0 ? (
          <p className="text-gray-500 text-lg">No new leaves</p>
        ) : (
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th isNumeric>No.</Th>
                <Th>Employee Name</Th>
                <Th isDate>From</Th>
                <Th isDate>To</Th>
                <Th>Leave Reason</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {leaveData.map((leave, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{leave.employeeName}</Td>
                  <Td>{new Date(leave.duration[0].date).toLocaleDateString()}</Td>
                  <Td>
                    {new Date(
                      leave.duration[leave.duration.length - 1].date
                    ).toLocaleDateString()}
                  </Td>
                  <Td>{leave.reason}</Td>
                  <Td>
                    <HStack spacing={5}>
                      <AcceptLeaveModal leaveId={leave._id} />
                      <RejectLeaveModal leaveId={leave._id} />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )
      )}
    </div>
  );
};

export default HandleLeave;
