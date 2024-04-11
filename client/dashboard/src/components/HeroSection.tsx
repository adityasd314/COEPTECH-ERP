"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "./ui/hero-highlight";
import { Spotlight } from "./ui/Spotlight";


function HeroSection() {
  return (
    <HeroHighlight className="h-[50rem] w-full dark:bg-grid-black/[0.2] bg-grid-black/[0.2]  bg-gray-300  text-black relative flex items-center justify-center">
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
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-black max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        Transforming college management with a unified platform{" "}<br/>
        <Highlight className="text-white ">
          Experience simplicity in complexity.<br/>
        </Highlight>
        <Highlight className="text-white ">
          A one stop Solution
        </Highlight>
      </motion.h1>
    </HeroHighlight>
  );

}

export default HeroSection;
