'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeroHighlight, Highlight } from './ui/hero-highlight';
import { Spotlight } from './ui/Spotlight';
import { useLogin } from '../../hooks/useLogin';
import LogOut from '../components/LogOut';
import { redirect } from 'next/navigation';

function HeroSection({
  user,
  setUser,
}: {
  user: any;
  setUser: (user: any) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { login, error, isLoading } = useLogin();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(email, password);
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
        // redirect('/');
        window.location.href = '/';
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  if (!isLoggedIn) {
    return (
      <HeroHighlight className="h-[50rem] w-full dark:bg-grid-black/[0.2] bg-grid-black/[0.2] bg-gray-300 text-black relative flex flex-col md:flex-row items-center justify-center">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-black max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto md:mr-8">
          Transforming college management with a unified platform <br />
          <Highlight className="text-white ">
            Experience simplicity in complexity.
            <br />
          </Highlight>
          <Highlight className="text-white ">A one-stop Solution</Highlight>
        </motion.h1>

        <section className="bg-gray-50 dark:bg-transparent">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-7 mt-10 md:h-screen lg:py-0">
            <div className="w-full bg-opacity-50 backdrop-blur-lg dark:bg-opacity-60 dark:bg-gray-600 dark:border-gray-600 rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
                </h1>
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Sign in
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </HeroHighlight>
    );
  } else {
    // Render alternative content when user is logged in
    return (
      <div className="pt-24">
        <h1>Welcome, {(user as any)?.email}</h1>
      </div>
    );
  }
}

export default HeroSection;
