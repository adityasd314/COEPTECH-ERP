import './LoginPage.css';
import React, { useState } from 'react';
import { Button, Stack } from '@chakra-ui/react';
import { useLogin } from '../hooks/useLogin';
import { Input } from '@chakra-ui/react'
import { useNavigate } from 'react-router';
import GeneralModal from './GeneralModal';

import loginImg from './Assets/login.jpg'

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const[modalProps, setModalProps] = useState({statusText : "",  isError: false, modalStatus: false});

  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate();

  const changeEmail = async (e) => {
    setEmail(e.target.value);
    document.getElementById("emailInput").style.borderColor = "black";
  };

  const changePassword = async (e) => {
    setPassword(e.target.value);
    document.getElementById("passwordInput").style.borderColor = "black";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      const user = localStorage.getItem("user");

      if (user) {
        document.cookie = `token=${user}`;
        navigate("/");
      } else {
        setModalProps({
          statusText: "Login failed. Please check your credentials.",
          isError: true,
          modalStatus: true,
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setModalProps({
        statusText: "An error occurred. Please try again later.",
        isError: true,
        modalStatus: true,
      });
    }
  };

  return (
    <>
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
        <div className='hidden sm:block'>
            <img className='w-full h-full object-cover' src={loginImg} alt="" />
        </div>

        <GeneralModal {...modalProps} />
        <div className='bg-gray-50 flex flex-col justify-center'>
            <form className='max-w-[500px] w-full mx-auto rounded-lg bg-gray-150 p-5 px-8'>
                <div className="logo-container">            
                  <img
                  src="/images/coeplogo.png"
                  alt="Coep Logo"
                  className="logo"
                /></div>  
                <Stack spacing={3}>
                  <Input type='email' onChange={changeEmail}
            id="emailInput" placeholder='LOGIN ID' color={'pink.500'} size='lg' />
                  <Input  type="password"
            placeholder="PASSWORD"
            id="passwordInput" color={'pink.500'} onChange={changePassword} size='lg' />
                </Stack>
                <div className='flex justify-between text-gray-400 py-2 '>
                    <p className='flex items-center' id='checkbox'><input className='mr-2' type="checkbox"  id='checkbox' /> Remember Me</p>
                    <p id="forgot">Forgot Password</p>
                </div>
                <div className="button-container"><Button size={"lg"} colorScheme={'pink'}  onClick={handleSubmit}> LOGIN</Button></div>
                
            </form>
        </div>
    </div>
    </>
    
  );
};

export default LoginPage;


