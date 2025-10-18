import { navigateTo } from '@devvit/web/client';
import { useCounter } from './hooks/useCounter';
import RedditWYR from './frontend.jsx';

export const App = () => {
  const { count, username, loading, increment, decrement } = useCounter();

  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-4">
      <img className="object-contain w-1/2 max-w-[250px] mx-auto" src="/snoo.png" alt="Snoo" />
      
      {/* 👇 Your new component here */}
      <RedditWYR />

      {/* Existing code below */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-center text-gray-900 ">
          {username ? `Hey ${username} 👋` : ''}
        </h1>
        <p className="text-base text-center text-gray-600 ">
          Edit <span className="bg-[#e5ebee]  px-1 py-0.5 rounded">src/client/App.tsx</span> to get started.
        </p>
      </div>
      ...
    </div>
  );
};
