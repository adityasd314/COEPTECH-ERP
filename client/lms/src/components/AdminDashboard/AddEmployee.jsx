import React, { useState, useEffect } from "react";
import { backendURL } from "../../config/config";
import { FaUserPlus } from "react-icons/fa";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  RadioGroup,
  Radio,
  Alert,
  AlertIcon,
  Button,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import GeneralModal from "../GeneralModal";
import SelectCsv from "./SelectCsv";
import axios from "axios";

const AddEmployee = () => {
  const [managers, setManagers] = useState([]);
  const [joiningdate, setJoiningDate] = useState("");
  const [employeeInfo, setEmployeeInfo] = useState({
    name: "",
    age: "",
    email: "",
    department: "",
    phone_number: "",
    manager: "admin",
    role: "",
  });
  const [modalProps, setModalProps] = useState({
    statusText: "",
    isError: false,
    modalStatus: false,
  });
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleChangeJoiningDate = (e) => {
    const selectedDate = e.target.value; // This should be a string in the format "yyyy-MM-dd"
    setJoiningDate(selectedDate);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAge = (age) => {
    return !isNaN(parseFloat(age)) && isFinite(age) && age > 0;
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get(backendURL + `/admin/getManagers`);
        setManagers(response.data);
      } catch (error) {
        console.error(
          "Error fetching managers:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchManagers();
  }, []);

  const sendRequest = async (employees) => {
    try {
      const response = await axios.post(backendURL + "/admin/addEmployees", {
        employees,
      });
    } catch (error) {
      console.error(
        "Error adding employees:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const onSubmit = () => {
    const { name, age, email, department, phone_number, manager, role } =
      employeeInfo;

    if (
      !name ||
      !phone_number ||
      !department ||
      !email ||
      !age ||
      !manager ||
      !role
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email address.");
      return;
    }

    if (!validateAge(age)) {
      setError("Age must be a valid number");
      return;
    }

    if (!validatePhoneNumber(phone_number)) {
      setError("Invalid phone number. It should be a 10-digit number.");
      return;
    }

    const employee = {
      name,
      age,
      email,
      joiningdate,
      department,
      phone_number,
      manager,
      role,
    };

    const employees = [employee];

    sendRequest(employees);

    setModalProps({
      statusText: "Teacher Added Successfully!",
      isError: false,
      modalStatus: true,
    });


    setIsOpen(false);
  };

  return (
    <div>
      <GeneralModal {...modalProps} />
      <Button
        onClick={() => setIsOpen(true)}
        colorScheme="transparent"
        style={{ fontSize: "36px", padding: "10px" }}
      >
        <FaUserPlus size="xl" />
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Teacher</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}
            <FormControl>
              <Stack>
                <FormLabel>Employee Name</FormLabel>
                <Input
                  variant="filled"
                  placeholder="Enter name"
                  size="lg"
                  type="text"
                  name="name"
                  mb={2}
                  value={employeeInfo.name}
                  onChange={handleChange}
                />
                <FormLabel>Age</FormLabel>
                <Input
                  variant="filled"
                  placeholder="Enter Age"
                  size="lg"
                  type="number"
                  name="age"
                  mb={2}
                  value={employeeInfo.age}
                  onChange={handleChange}
                  onWheel={(event) => {
                    event.currentTarget.blur();
                  }}
                />

                <FormLabel>Email</FormLabel>
                <Input
                  variant="filled"
                  placeholder="Enter Email"
                  size="lg"
                  name="email"
                  type="email"
                  mb={2}
                  value={employeeInfo.email}
                  onChange={handleChange}
                />
                <FormLabel>Joining Date</FormLabel>
                <Input
                  size="lg"
                  type="date"
                  value={joiningdate}
                  onChange={handleChangeJoiningDate}
                />
                <FormLabel>Department</FormLabel>
                <Input
                  variant="filled"
                  placeholder="Enter department"
                  size="lg"
                  type="text"
                  name="department"
                  mb={2}
                  value={employeeInfo.department}
                  onChange={handleChange}
                />

                <FormLabel>Contact</FormLabel>
                <Input
                  variant="filled"
                  placeholder="Enter contact number"
                  size="lg"
                  type="number"
                  name="phone_number"
                  onWheel={(event) => {
                    event.currentTarget.blur();
                  }}
                  mb={2}
                  value={employeeInfo.phone_number}
                  onChange={handleChange}
                />

                <FormLabel>Role</FormLabel>
                <Select
                  placeholder="Select Role"
                  size="lg"
                  name="role"
                  value={employeeInfo.role}
                  mb={2}
                  onChange={handleChange}
                >
                  <option value="teacher">Teacher</option>
                  <option value="hod">HOD</option>
                </Select>

                {employeeInfo.role === "teacher" && (
                  <>
                    <FormLabel>Manager</FormLabel>
                    <Select
                      placeholder="Select Manager"
                      size="lg"
                      name="manager"
                      value={employeeInfo.manager}
                      mb={2}
                      onChange={handleChange}
                    >
                      {managers.map((manager) => (
                        <option key={manager._id} value={manager._id}>
                          {manager.info.name}
                        </option>
                      ))}
                    </Select>
                  </>
                )}
              </Stack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                height: "max-content",
                width: "100%",
              }}
            >
              <SelectCsv sendRequest={sendRequest} managers={managers} />
              <Stack direction="row" spacing={5}>
                <Button
                  colorScheme="teal"
                  size="md"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button colorScheme="teal" size="md" onClick={onSubmit}>
                  Save
                </Button>
              </Stack>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddEmployee;
