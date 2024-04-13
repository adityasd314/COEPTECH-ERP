'use client';
import FeaturedCourses from '@/components/FeaturedCourses';
import HeroSection from '@/components/HeroSection';
// import MusicSchoolTestimonials from "@/components/TestimonialCards";
// import WhyChooseUs from "@/components/WhyChooseUs";
import Notices from '../../../../utils/Notices/Notices';
import Chatbot from '@/components/Chatbot';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <main className="min-h-screen bg-gray-300 dark:bg-grid-black/[0.2] antialiased bg-grid-white/[0.02]">
      <HeroSection user={user} setUser={setUser} />
      <FeaturedCourses />
      <Notices />
      <Chatbot />
      {/* <MusicSchoolTestimonials/> */}
    </main>
  );
}
