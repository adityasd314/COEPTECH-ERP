import { Box, Heading, Text } from '@chakra-ui/react';

export default function AdminDashboard({ user }) {
  return (
    <Box>
      <Heading
        as="h1"
        size="2xl"
        textAlign="center"
        mt={4}
        mb={4}
        color="teal.500">
        Admin Dashboard
      </Heading>
      <Text
        textAlign="center"
        fontSize="xl"
        color="gray.700"
        textTransform={'capitalize'}>
        Welcome {user.email.split('@')[0]}
      </Text>
    </Box>
  );
}
