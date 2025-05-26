"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const UnderConstructionPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-6xl md:text-8xl font-pecita mb-8">
          Oops!
        </h1>
        <motion.div
          animate={{
            rotate: [0, -2, 2, -2, 0],
            //y: [0, -8, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1]
          }}
          className="text-9xl md:text-[12rem] mb-8"
        >
          🚧
        </motion.div>
        <p className="text-2xl md:text-4xl font-poppins mb-4">
          This Page is Under Construction
        </p>
        <p className="text-lg md:text-xl text-muted-foreground font-poppins mb-8">
          Our digital elves are working hard (and occasionally taking coffee breaks).
          <br />
          Something awesome is brewing here!
        </p>
        <motion.button
          whileHover={{ scale: 1.1, y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push('/')}
          className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-poppins text-lg hover:bg-primary/90 transition-colors shadow-md"
        >
          Go home
        </motion.button>
      </motion.div>

      {/*<motion.div
        className="absolute bottom-10 w-full flex justify-center items-center space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -15, 0, 15, 0],
              scale: [1, 1.2, 1, 0.8, 1],
              backgroundColor: ["#FFD700", "#FF8C00", "#FF4500", "#FF6347", "#FFD700"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
            className="w-6 h-6 rounded-full bg-primary"
          />
        ))}
      </motion.div>*/}
    </div>
  );
};

export default UnderConstructionPage; 