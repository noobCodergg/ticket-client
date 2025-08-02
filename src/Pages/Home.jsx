import { Button } from '@/components/ui/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  return (
    <div className="h-screen w-full bg-[url('https://images.unsplash.com/photo-1536607231049-ff582b18d159?q=80&w=1078&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center flex items-center">
      <div className="ml-20 bg-black bg-opacity-50 p-10 rounded-xl text-white max-w-2xl text-left">
        <h1 className="text-6xl font-bold mb-6 leading-tight">
          Welcome to Our Ticket Platform
        </h1>
        <p className="text-xl mb-8">
          Find and book your favorite operator bus ticket <br/> quickly and easily.
        </p>
      </div>
    </div>
  );
};

export default Home;


