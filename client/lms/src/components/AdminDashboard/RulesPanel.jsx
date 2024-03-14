import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import { useAuthContext } from "../../hooks/useAuthContext";
import { backendURL } from "../../config/config";
  
  const RulesPanel = () => {
    const { user } = useAuthContext();

    const [rules, setRules] = useState([]);
    const [editedRules, setEditedRules] = useState([]);
  
    useEffect(() => {
      const fetchRules = async () => {
        try {
          const response = await axios.get(backendURL + "/rule/get");
          setRules(response.data);
          setEditedRules(response.data.map(() => false));
        } catch (error) {
          console.error("Error fetching rules:", error.message);
        }
      };
  
      fetchRules();
    }, []);
  
    const handleContentChange = (index, newContent) => {
      setEditedRules((prevEditedRules) => [
        ...prevEditedRules.slice(0, index),
        true,
        ...prevEditedRules.slice(index + 1),
      ]);
  
      setRules((prevRules) => [
        ...prevRules.slice(0, index),
        { ...prevRules[index], content: newContent },
        ...prevRules.slice(index + 1),
      ]);
    };
  
    const handleSaveButtonClick = async () => {
      try {
        const editedRulesToSave = rules.filter((_, index) => editedRules[index]);
        await axios.post(backendURL + "/rule/edit", {editedRules: editedRulesToSave, id: user._id, password: user.password});
        setEditedRules(editedRules.map(() => false));
      } catch (error) {
        console.error("Error updating rules:", error.message);
      }
    };
  
    return (
      <>
        <TableContainer overflowX="auto" minWidth="100%">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>No.</Th>
                <Th>Heading</Th>
                <Th>Rules</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rules.map((rule, i) => (
                <Tr key={rule._id}>
                  <Td>{i + 1}</Td>
                  <Td>{rule.title}</Td>
                  <Td
                    contentEditable
                    onBlur={(e) => handleContentChange(i, e.target.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: rule.content }}
                  />
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
  
        <Button onClick={handleSaveButtonClick} mt="4">
          Save Changes
        </Button>
      </>
    );
  };
  
  export default RulesPanel;
  