import { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  RadioGroup,
  Stack,
  Radio,
  Text,
  Box,
  Heading,
} from '@chakra-ui/react';
import LECTURE_FEEDBACK from '../../constants/lecture_feedback';

import { useForm } from 'react-hook-form';

const FeedbackFormModal = ({ data, isOpen, onClose }) => {
  const { register, handleSubmit } = useForm();
  const [feedback, setFeedback] = useState('');

  const onSubmit = (data) => {
    console.log(data); // You can handle form submission logic here
    onClose();
  };

  const RATING = {
    1: 'Poor',
    2: 'Fair',
    3: 'Average',
    4: 'Good',
    5: 'Excellent',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Provide Feedback</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box maxW="500px" mx="auto" mt="4">
            <Heading mb="4">Lecture Feedback Form</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              {Object.entries(LECTURE_FEEDBACK).map(([category, questions]) => (
                <Box key={category} mb="4">
                  <Text textTransform={'capitalize'}>{category}</Text>
                  {questions.map((question, index) => (
                    <FormControl key={index} mb="4">
                      <FormLabel>{question}</FormLabel>

                      <RadioGroup>
                        <Stack direction="column">
                          {['1', '2', '3', '4', '5'].map((value, idx) => (
                            <Radio
                              key={idx}
                              {...register(`${category}${index}`, {
                                required: true,
                              })}
                              value={value}>
                              {RATING[value]}
                            </Radio>
                          ))}
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  ))}
                </Box>
              ))}
              <FormControl mb="4">
                <FormLabel>
                  Are there any specific areas where improvements could be made?
                </FormLabel>
                <Textarea
                  {...register('comments')}
                  placeholder="Enter your comments here"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="blue" type="submit">
                Submit
              </Button>
            </form>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Text fontSize="sm">
            Feedback for {data.course_id} by {data.professor_name}
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FeedbackFormModal;
