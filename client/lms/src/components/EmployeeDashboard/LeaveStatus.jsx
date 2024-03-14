import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Stack,
  Alert,
  AlertIcon,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Select, // Import Select component from Chakra UI
} from "@chakra-ui/react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { backendURL } from "../../config/config";

const LeaveStatus = ({ employeeId, isActive, isAdmin }) => {
  const [leaveData, setLeaveData] = useState([]);
  const [accumulated,setAccumulated] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // State for selected status filter
  const calculateDaysDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.round(differenceInDays)+1;
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const cancel = async (leaveId) => {
    const cancelLeave = {
      employeeId,
      leaveId,
      password,
    };


    try {
      const response = await axios.post(
        backendURL+"/employee/cancel",
        cancelLeave
      );

      if (response.status == 200) {
        onClose(); 
        setPassword(""); 
      }
      
    } catch (error) {
      setError(error)
      console.error("Error canceling leave:", error.message);
      setError("Error canceling leave. Please try again.");
    }
  };

  useEffect(() => {
    const getaccumulatedLeave = async () => {
        try {
            const response = await axios.post(backendURL+"/employee/getEmployeeData", { _id: employeeId });
            setAccumulated(response.data.accumulatedLeaves); // Assuming accumulatedLeaves is in response.data
        } catch (error) {
            console.error(
                "Error fetching data:",
                error.response ? error.response.data : error.message
            );
        }
    };

    // Call the function inside useEffect
    getaccumulatedLeave();

    // Dependency array containing employeeId
}, [employeeId]);


  useEffect(() => {
    const getLeaves = async () => {
      try {
        const response = await axios.post(
          backendURL+"/employee/getLeavesByEmployeeId",
          { employeeId }
        );
        setLeaveData(response.data);
      } catch (error) {
        console.error(
          "Error fetching leaves:",
          error.response ? error.response.data : error.message
        );
      }
    };
    getLeaves(employeeId);
  }, [employeeId]);

  const filteredLeaves = leaveData.filter((leave) => {
    // Filter by search term
    const searchTermMatches =
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.duration.some((d) =>
        new Date(d.date).toLocaleDateString().includes(searchTerm)
      );
    // Filter by status if selected
    const statusMatches = !filterStatus || leave.status === filterStatus;
    return searchTermMatches && statusMatches;
  });

  return (
    <div>
      <Stack direction="row" spacing={4} mb={4} align="center">
        <InputGroup w="420px">
          <Input
            placeholder="Search leave reason or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        {/* Selector for filtering by status */}
        <Select
          placeholder="Filter by status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          w="200px"
        >
          <option value="accepted">Accepted</option>
          <option value="cancel">Canceled</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
        </Select>

        {!isAdmin?<div className="flex mb-1 justify-end gap-10 ">
          <span style={{ fontWeight: 'bold', background: '#f0f0f0', padding: '5px' }}>
            Accumulated Leaves: {accumulated}
          </span>
        </div>:null}
      </Stack>

      <TableContainer>
        <Table variant="simple" size="lg" color={"black"}>
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>Leave Reason</Th>
              <Th isDate>From</Th>
              <Th isDate>To</Th>
              <Th>Days</Th>
              <Th>Status</Th>
              {isAdmin ? null : <Th>Action</Th>}
              <Th>Note</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredLeaves.map((leave, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{leave.reason}</Td>
                <Td>
                  {new Date(leave.duration[0].date).toLocaleDateString()}
                </Td>
                <Td>
                  {new Date(
                    leave.duration[leave.duration.length - 1].date
                  ).toLocaleDateString()}
                </Td>
                <Td>
                  {/* Calculate the number of days */}
                  {calculateDaysDifference(leave.duration[0].date, leave.duration[leave.duration.length - 1].date)}
                </Td>
                {leave.status === "Pending" ? (
                  <Td style={{ color: " #FFB200" }}>
                    {leave.status[0].toUpperCase() +
                      leave.status.slice(1).toLowerCase()}
                  </Td>
                ) : leave.status === "accepted" ? (
                  <Td style={{ color: "green" }}>
                    {leave.status[0].toUpperCase() +
                      leave.status.slice(1).toLowerCase()}
                  </Td>
                ) : leave.status === "cancel" ? (
                  <Td style={{ color: "brown" }}>
                    {leave.status[0].toUpperCase() +
                      leave.status.slice(1).toLowerCase()}
                  </Td>
                ) : leave.status === "rejected" ? (
                  <Td style={{ color: "red" }}>
                    {leave.status[0].toUpperCase() +
                      leave.status.slice(1).toLowerCase()}
                  </Td>
                ) : leave.status === "cancel" ? (
                  <Td style={{ color: "black" }}>
                    {leave.status[0].toUpperCase() +
                      leave.status.slice(1).toLowerCase() + "ed"}
                  </Td>
                ) : (
                  <Td>{leave.status}</Td>
                )}
                {isAdmin ? null : (
                  <Td>
                    {leave.status === "rejected" || leave.status === "cancel" ? null : (
                      <Button onClick={onOpen} size="md">
                        Cancel Leave
                      </Button>
                    )}
                  </Td>
                )}
                <Td>{leave.note || null}</Td>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent maxW="xl">
                    <ModalHeader>Cancel Leave</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      {error && (
                        <Alert status="error" mb={4}>
                          <AlertIcon />
                          {error}
                        </Alert>
                      )}
                      <Stack spacing={5}>
                        <InputGroup size="lg">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={password}
                            onChange={handlePasswordChange}
                          />
                          <InputRightElement width="3rem">
                            <IconButton
                              h="1.75rem"
                              size="md"
                              onClick={handleTogglePasswordVisibility}
                              colorScheme="transparent"
                              icon={
                                showPassword ? <IoMdEyeOff /> : <IoMdEye />
                              }
                            />
                          </InputRightElement>
                        </InputGroup>
                      </Stack>
                    </ModalBody>
                    <ModalFooter>
                      <Stack direction="row" spacing={5}>
                        <Button
                          colorScheme="green"
                          size="md"
                          onClick={() => cancel(leave._id)}
                        >
                          Cancel Leave
                        </Button>
                      </Stack>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LeaveStatus;
