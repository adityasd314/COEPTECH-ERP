import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
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
import { GrFormEdit } from "react-icons/gr";
import axios from "axios";
import DeleteEmployee from "./DeleteEmployee";
import { backendURL } from "../../config/config";
import { useAuthContext } from "../../hooks/useAuthContext";


const EditEmployee = ({employeeId}) => {
  const { user } = useAuthContext();
  const [managers, setManagers] = useState([]);
  const [adminId,setAdminId] = useState("")
  const [employeeInfo, setEmployeeInfo] = useState({
    _id: employeeId,
    name: "",
    age: "",
    email: "",
    position: "",
    phone_number: "",
    manager: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };   

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAge = (age) => {
    return !isNaN(parseFloat(age)) && isFinite(age) && age > 0;
  };

  const validatePhoneNumber = (phoneNumber) => {
    if (phoneNumber === "") {
      return true;
    }
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };
  
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get(backendURL + "/admin/getManagers");
        setManagers(response.data);
      } catch (error) {
        console.error("Error fetching managers:", error.response ? error.response.data : error.message);
      }
    };

    fetchManagers();
  }, []);

  useEffect(()=>{
    const getEmployeeData = async (employeeId) => {
      try {
        const response = await axios.post(backendURL + "/admin/getEmployeeById", {_id: employeeId} );
        const foundEmployee = response.data;
      
      if (foundEmployee) {
        const existing_employee = {
          _id: foundEmployee._id,
          name: foundEmployee.info.name,
          age: foundEmployee.info.age,
          email: foundEmployee.email,
          position: foundEmployee.info.position,
          phone_number: foundEmployee.info.phone_number,
          manager: foundEmployee.info.manager,
          role: foundEmployee.role,
        }
        setEmployeeInfo(existing_employee)

      } else {
        console.log(`Employee with ID ${employeeId} not found`);
      }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    getEmployeeData(employeeId);
  },[])
  
  const sendRequest = async (employee) => {
    try {

      const response = await axios.post(
        backendURL + "/admin/update",
       employeeInfo
      );

    } catch (error) {
      console.error(
        "Error adding employees:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const deleteButton = (admin_id,employee_id,password) =>{
    if(password === "")
    {
      pleas
    }
  }
  
  const onSubmit = () => {
    const { _id , name, age, email, position, phone_number, manager, role } = employeeInfo;
  
    if (!name || !phone_number || !position || !email || !age || !manager || !role) {
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
  
    sendRequest(employeeInfo);
  
    setIsOpen(false);
  };
  

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} colorScheme="transparent">
        <GrFormEdit size="sm" />
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Employee</ModalHeader>
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
                  placeholder={employeeInfo.name}
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

                <FormLabel>Position</FormLabel>
                <Input
                  variant="filled"
                  placeholder="Enter Position"
                  size="lg"
                  type="text"
                  name="position"
                  mb={2}
                  value={employeeInfo.position}
                  onChange={handleChange}
                />

                <FormLabel>Contact</FormLabel>
                <Input
                  variant="filled"
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
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </Select>

                {employeeInfo.role === "employee" && (
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
          <div style={{
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  height: 'max-content',
  width: '100%'
}}>
              <Stack direction="row" spacing={5}>
                <Button
                  colorScheme="teal"
                  size="md"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                {user.role==="admin"?<DeleteEmployee employeeId={employeeId} />:null}
                <Button colorScheme="green" size="md" onClick={onSubmit}>
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

export default EditEmployee;
