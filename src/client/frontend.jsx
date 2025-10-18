import React, { useState, useEffect } from 'react';
import { Flame, Users, Clock } from 'lucide-react';

export default function RedditWYR() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [questions, setQuestions] = useState([
    {
      question: "You get your most Attractive and Ideal partner but,",
      optionA: { text: "Has family that all kiss each other on the mouth", votes: 3258 },
      optionB: { text: "Extremely clingy and possessive", votes: 1639 }
    },
    {
      question: "Would you rather have",
      optionA: { text: "Unlimited money but can never travel", votes: 2100 },
      optionB: { text: "Free travel forever but always be broke", votes: 3900 }
    },
    {
      question: "Choose your superpower",
      optionA: { text: "Read minds but can't turn it off", votes: 1500 },
      optionB: { text: "Fly but only 3 feet off the ground", votes: 2800 }
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Fetch questions from API
  useEffect(() => {
    // Uncomment to fetch from your API
    // fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('YOUR_API_ENDPOINT_HERE');
      const data = await response.json();
      
      // Transform API data to match component format
      const transformedQuestions = data.map(poll => ({
        question: poll.question,
        optionA: { 
          text: poll.option_A, 
          votes: poll.option_A_count 
        },
        optionB: { 
          text: poll.option_B, 
          votes: poll.option_B_count 
        }
      }));
      
      setQuestions(transformedQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  const currentQ = questions[currentIndex];

  // Calculate time based on question length
  const calculateTime = (question) => {
    if (!question) return 10;
    const totalLength = question.question.length + question.optionA.text.length + question.optionB.text.length;
    return Math.max(8, Math.ceil(8 + totalLength * 0.08));
  };

  // Reset timer when question changes
  useEffect(() => {
    if (currentQ) {
      setTimeLeft(calculateTime(currentQ));
    }
  }, [currentIndex]);

  // Timer countdown
  useEffect(() => {
    if (showResults || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto advance to next question
          setTimeout(() => {
            if (currentIndex < questions.length - 1) {
              setCurrentIndex(currentIndex + 1);
              setShowResults(false);
              setStreak(0);
            }
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults, currentIndex, questions.length]);

  const totalVotes = currentQ ? currentQ.optionA.votes + currentQ.optionB.votes : 0;
  const percentA = currentQ && totalVotes > 0 ? ((currentQ.optionA.votes / totalVotes) * 100).toFixed(0) : 0;
  const percentB = currentQ && totalVotes > 0 ? ((currentQ.optionB.votes / totalVotes) * 100).toFixed(0) : 0;

  const handleVote = (option) => {
    // Optimistic UI update
    setShowResults(true);
    setStreak(prev => prev + 1);
    
    // Update local vote count
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...updatedQuestions[currentIndex],
      [option]: {
        ...updatedQuestions[currentIndex][option],
        votes: updatedQuestions[currentIndex][option].votes + 1
      }
    };
    setQuestions(updatedQuestions);

    // TODO: Send vote to your backend API
    // try {
    //   await fetch('YOUR_VOTE_API_ENDPOINT', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ option: option })
    //   });
    // } catch (error) {
    //   console.error('Error submitting vote:', error);
    // }
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setShowResults(false);
      }
    }, 1500);
  };

  const handleSkip = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowResults(false);
      setStreak(0);
    }
  };

  const getEmoji = (text, isOptionA) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('money') || lowerText.includes('rich')) return '💰';
    if (lowerText.includes('love') || lowerText.includes('heart')) return '❤️';
    if (lowerText.includes('food') || lowerText.includes('eat')) return '🍕';
    if (lowerText.includes('travel') || lowerText.includes('fly')) return '✈️';
    if (lowerText.includes('family')) return '👨‍👩‍👧‍👦';
    if (lowerText.includes('clingy') || lowerText.includes('possessive')) return '🔗';
    if (lowerText.includes('mind') || lowerText.includes('read')) return '🧠';
    if (lowerText.includes('broke') || lowerText.includes('poor')) return '💸';
    return isOptionA ? '🅰️' : '🅱️';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔄</div>
          <div className="text-2xl font-bold">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <div className="text-2xl font-bold">All questions completed!</div>
          <div className="mt-4 text-gray-400">Final Streak: {streak}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">Would You Rather</h1>
          <div className="text-orange-400 font-semibold">r/WouldYouRather</div>
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
            style={{ width: `${(timeLeft / calculateTime(currentQ)) * 100}%` }}
          ></div>
        </div>

        {/* Question Text */}
        <div className="text-center mb-8 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white/90">
            {currentQ.question}
          </h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Option A */}
          <button
            onClick={() => !showResults && handleVote('optionA')}
            disabled={showResults}
            className="bg-white/10 hover:bg-white/20 disabled:hover:bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/20 transition-all hover:scale-105 active:scale-95"
          >
            <div className="text-6xl mb-4">{getEmoji(currentQ.optionA.text, true)}</div>
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
            <div className="text-6xl mb-4">{getEmoji(currentQ.optionB.text, false)}</div>
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
              onClick={handleSkip}
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
