// ProfileCardA.js
import React from 'react';
import {
  Box,
  Avatar,
  Heading,
  Text,
  Flex,
  Button,
  Modal,
  ModalContent,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
// import LogoutButton from "./LogoutButton";// Assuming LogoutButton is in the same directory
const ProfileCardA = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return null;
  }

  return (
    <>
      <div onClick={onOpen} className="bg-white p-2 rounded-full">
        <Icon as={CgProfile} boxSize={8} />
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="sm" placement="top-end">
        <ModalContent
          containerProps={{
            justifyContent: 'flex-end',
            paddingRight: '2rem',
            marginTop: '2rem',
          }}>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            p="4">
            <Flex align="center" mb="3">
              <Avatar src="https://bit.ly/dan-abramov" size="lg" />
              <Box ml="3">
                <Heading as="h2" size="md">
                  {user.info ? user.info.name : 'Unknown'}
                </Heading>
                <Text color="gray.600">{user.role}</Text>
              </Box>
            </Flex>
            <div
              style={{
                height: 'max-content',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
                <Button onClick={()=>{
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  window.location.reload();
                }}>
                  Logout
                </Button>
            </div>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileCardA;
