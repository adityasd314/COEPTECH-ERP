import { Box, Heading, Text } from '@chakra-ui/react';

function FacultyDashboard({ user }) {
  return (
    <Box>
      <Heading
        as="h1"
        size="2xl"
        textAlign="center"
        mt={4}
        mb={4}
        color="teal.500">
        Student Dashboard
      </Heading>
      <Text textAlign="center" fontSize="xl" color="gray.700">
        Welcome {user.email.split('@')[0]}
      </Text>
      <Cards setModalOpen={setModalOpen} data={llData} setData={setData} />
      <FeedbackFormModal
        data={data}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      />
    </Box>
  );
}

export default FacultyDashboard;
