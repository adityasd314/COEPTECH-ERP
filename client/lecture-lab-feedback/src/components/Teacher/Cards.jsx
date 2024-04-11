import { Box } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
export default function Cards({ data, setModalOpen, setData }) {
  console.log('data', data);
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="space-evenly"
      alignItems="center"
      p={4}
      bg={'gray.100'}
      m={4}
      borderRadius={8}
      shadow={'md'}>
      {data.map((item) => (
        <Card
          key={item.id}
          shadow={'md'}
          borderWidth={2}
          px={4}
          m={4}
          borderRadius={8}
          bg={item.type == 'LAB' ? '#d9edf8' : '#e4f1ee'}
          minW={'sm'}
          maxW={'sm'}
          minH={'3xs'}
          overflow={'hidden'}
          boxShadow={'lg'}
          rounded={'lg'}
          borderColor={'gray.300'}
          cursor={'pointer'}
          transition={'all 0.3s ease-in-out'}
          _active={{
            bg: 'gray.400',
            transform: 'scale(0.95)',
          }}
          _focus={{
            boxShadow: 'outline',
          }}
          _disabled={{
            opacity: 0.4,
            cursor: 'not-allowed',
          }}>
          <CardHeader>
            {item.course_id} <br /> {item.course_name}
          </CardHeader>
          <CardBody>
            <p>
              {item.type} by {item.professor_name}{' '}
            </p>
            <p>{item.date_time.toDateString()}</p>
            <p>{item.location}</p>
            <p>{item.duration}</p>
          </CardBody>
          <CardFooter>
            <Button
              colorScheme="yellow"
              variant="solid"
              onClick={() => {
                setData(item);
                setModalOpen(true);
              }}>
              Give Feedback
            </Button>
          </CardFooter>
        </Card>
      ))}
    </Box>
  );
}
