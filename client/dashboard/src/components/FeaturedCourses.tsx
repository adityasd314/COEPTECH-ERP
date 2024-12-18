'use client';
import Link from 'next/link';
import courseData from '../data/apps';
import { BackgroundGradient } from './ui/background-gradient';
import { HeroHighlight, Highlight } from './ui/hero-highlight';
import { useEffect } from 'react';

interface Course {
  port?: number;
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  instructor: string;
  isFeatured: boolean;
}

const ports = {};

function FeaturedCourses() {
  const featuredCourses = courseData.filter(
    (course: Course) => course.isFeatured
  );

  const user = localStorage.getItem('user');

  return (
    <div
      className="pt-12 py-12  bg-gray-300 dark:bg-grid-black/[0.2]"
      style={{ marginBottom: '30vh' }}>
      <div>
        <div className="text-center">
          <br />
          <br />
          <br />
          <br />
          <p
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-black sm:text-4xl"
            style={{
              wordSpacing: '0.3em',
            }}>
            ONE PLATFORM FOR ALL THE PROBLEMS
          </p>
        </div>
      </div>
      <div className="mt-10 mx-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {featuredCourses.map((course: Course, i) => (
            <Link
              key={i}
              href={
                encodeURI(JSON.stringify(JSON.parse(user!)))
                  ? `http://localhost:${course.port}?user=${encodeURI(
                      JSON.stringify(JSON.parse(user!))
                    )} `
                  : `http://localhost:${course.port}`
              }>
              <div className="flex justify-center">
                <BackgroundGradient className="flex flex-col rounded-[10px] bg-white dark:bg-white overflow-hidden h-full max-w-sm">
                  <div className="p-4 sm:p-6 flex flex-col items-center text-center flex-grow">
                    <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-black">
                      {course.title}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-black flex-grow">
                      {course.description}
                    </p>
                    {/* <Link href={`/courses/${course.slug}`}>
                      <div className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full inline-block mt-4 transition duration-300 ease-in-out">
                        Learn More
                      </div>
                    </Link> */}
                  </div>
                </BackgroundGradient>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturedCourses;
