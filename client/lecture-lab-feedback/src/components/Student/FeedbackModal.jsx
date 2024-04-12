import { useEffect, useState } from 'react';
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

import { LECTURE_FEEDBACK, LAB_FEEDBACK } from '../../constants/feedback';
const API_ENDPOINT =
  import.meta.env.VITE_API_ENDPOINT || 'http://localhost:5000';
import { useForm } from 'react-hook-form';
const FeedbackFormModal = ({ data, isOpen, onClose, user }) => {
  const { register, handleSubmit } = useForm();
  const [feedback, setFeedback] = useState('');

  const handleSubmitForm = async () => {
    console.log(data);
    const response = await fetch(API_ENDPOINT + '/lecture-lab/student/submitFeedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.userId,
        courseId: data.courseId,
        sessionType: data.type,
        sessionId: data.id,
        data: JSON.stringify({
          ...Object.fromEntries(
            Object.entries(
              data.type == 'LECTURE' ? LECTURE_FEEDBACK : LAB_FEEDBACK
            ).map(([category, questions]) => [
              category,
              questions.map((question, index) => ({
                [question]: getValues(`${category}${index}`),
              })),
            ])
          ),
        }),
        professorId: data.professorId,
        departmentId: data.departmentId,
      })});
    console.log(response);

    onClose();
  };

  const getValues = (name) => { 
    return document.querySelector(`input[name="${name}"]:checked`).value;
  };

  const RATING = {
    1: 'Poor',
    2: 'Fair',
    3: 'Average',
    4: 'Good',
    5: 'Excellent',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent height={'80vh'}>
        <ModalHeader>Provide Feedback</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflow={'scroll'}>
          <Box maxW="500px" mx="auto" mt="4">
            <Heading fontSize={'large'} mb="4" textTransform={'capitalize'}>
              {data.courseName}
            </Heading>
            <form>
              {Object.entries(
                data.type == 'LECTURE' ? LECTURE_FEEDBACK : LAB_FEEDBACK
              ).map(([category, questions]) => (
                <Box key={category} mb="4">
                  <Text
                    fontSize={'medium'}
                    textTransform={'capitalize'}
                    fontWeight={'bold'}>
                    {category}
                  </Text>
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
              <Button colorScheme="blue" onClick={handleSubmitForm}>
                Submit
              </Button>
            </form>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Text fontSize="sm">
            Feedback for {data.courseCode} by {data.professorName}
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FeedbackFormModal;
