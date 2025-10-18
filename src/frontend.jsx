import React, { useState, useEffect } from 'react';
import { Flame, Users, Clock } from 'lucide-react';

export default function RedditWYR() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const questions = [
    {
      subreddit: "r/wallstreetbets",
      optionA: { text: "Diamond hands 💎 through -80%", emoji: "💎", votes: 3847 },
      optionB: { text: "Paper hands 📄 but sell at top", emoji: "📄", votes: 2653 }
    },
    {
      subreddit: "r/AskReddit",
      optionA: { text: "Fight 100 duck-sized horses", emoji: "🦆", votes: 5234 },
      optionB: { text: "Fight 1 horse-sized duck", emoji: "🐴", votes: 4123 }
    },
    {
      subreddit: "r/gaming",
      optionA: { text: "Only indie games forever", emoji: "🎨", votes: 2891 },
      optionB: { text: "Only AAA games forever", emoji: "💰", votes: 4567 }
    }
  ];

  const currentQ = questions[currentIndex];
  const [votes, setVotes] = useState(currentQ);

  // Calculate time based on question length (characters)
  const calculateTime = (question) => {
    const totalLength = question.optionA.text.length + question.optionB.text.length;
    // Base: 5 seconds + 0.1 second per character
    return Math.max(5, Math.ceil(5 + totalLength * 0.1));
  };

  const maxTime = calculateTime(currentQ);

  // Timer effect
  useEffect(() => {
    setTimeLeft(maxTime);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && !showResults) {
          // Time's up! Skip to next question
          if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setVotes(questions[currentIndex + 1]);
            setShowResults(false);
            setStreak(0); // Reset streak on skip
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, showResults, maxTime]);

  const totalVotes = votes.optionA.votes + votes.optionB.votes;
  const percentA = ((votes.optionA.votes / totalVotes) * 100).toFixed(0);
  const percentB = ((votes.optionB.votes / totalVotes) * 100).toFixed(0);

  const handleVote = (option) => {
    setVotes(prev => ({
      ...prev,
      [option]: { ...prev[option], votes: prev[option].votes + 1 }
    }));
    setShowResults(true);
    setStreak(prev => prev + 1);
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setVotes(questions[currentIndex + 1]);
        setShowResults(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">Would You Rather</h1>
          <div className="text-orange-400 font-semibold">{currentQ.subreddit}</div>
        </div>

        {/* Timer and Streak */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="bg-orange-500 px-6 py-2 rounded-full flex items-center gap-2">
            <Flame className="w-5 h-5" />
            <span className="font-bold">{streak} Streak</span>
          </div>
          <div className={`px-6 py-2 rounded-full flex items-center gap-2 transition-colors ${
            timeLeft <= 3 ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="font-bold">{timeLeft}s</span>
          </div>
        </div>

        {/* Timer Progress Bar */}
        <div className="mb-6 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${
              timeLeft <= 3 ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${(timeLeft / maxTime) * 100}%` }}
          ></div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Option A */}
          <button
            onClick={() => !showResults && handleVote('optionA')}
            disabled={showResults}
            className="bg-white/10 hover:bg-white/20 disabled:hover:bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/20 transition-all hover:scale-105 active:scale-95"
          >
            <div className="text-6xl mb-4">{currentQ.optionA.emoji}</div>
            <p className="text-xl font-bold mb-4">{currentQ.optionA.text}</p>
            {showResults && (
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">{percentA}%</div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${percentA}%` }}></div>
                </div>
              </div>
            )}
          </button>

          {/* Option B */}
          <button
            onClick={() => !showResults && handleVote('optionB')}
            disabled={showResults}
            className="bg-white/10 hover:bg-white/20 disabled:hover:bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/20 transition-all hover:scale-105 active:scale-95"
          >
            <div className="text-6xl mb-4">{currentQ.optionB.emoji}</div>
            <p className="text-xl font-bold mb-4">{currentQ.optionB.text}</p>
            {showResults && (
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">{percentB}%</div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${percentB}%` }}></div>
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">{totalVotes.toLocaleString()} votes</span>
          </div>
          <div className="text-sm text-gray-400">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {/* Skip Button */}
        {!showResults && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                if (currentIndex < questions.length - 1) {
                  setCurrentIndex(prev => prev + 1);
                  setVotes(questions[currentIndex + 1]);
                  setShowResults(false);
                  setStreak(0);
                }
              }}
              className="text-gray-400 hover:text-white transition-colors text-sm underline"
            >
              Skip Question →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
