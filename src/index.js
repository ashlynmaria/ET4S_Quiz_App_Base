import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App1';
import App2 from './App2';
import reportWebVitals from './reportWebVitals';
import Footer from './Components/Footer';
import MiniDrawer from './Components/Drawer';
import Home from './Components/Home';
import MissionPlanetHopper from './Components/A_Quiz.jsx';
import Header from './Components/Header';
import A_MCQPage from './Components/MCQ/A_MCQPage.js';
import B_MCQPage from './Components/MCQ/B_MCQPage.js';
import Quizzes from './Quizzes';
import DndPage from './Components/DragnDrop/A_dnd_Quiz.js';
import './App.css'; // Ensure this path is correct based on your project structure
import MatchQuestions from './Components/Match/A_MatchQuestions.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthProvider } from './useAuth';
import A_MatchPage from './Components/Match/A_MatchQuestions.js';
import B_MatchPage from './Components/Match/B_MatchQuestions.js';
import A_DndPage from './Components/DragnDrop/A_dnd_Quiz.js';
import B_DndPage from './Components/DragnDrop/B_dnd_Quiz.js';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import { UserProvider, useUser } from './UserContext';
import { db } from './firebaseConfig'; // Adjust path if needed
import { doc, onSnapshot } from 'firebase/firestore';
import MissionPlanetHopper2 from './Components/B_Quiz.jsx';

// lib/utils.ts
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function MyPage() {
  const [curPage, setPage] = useState(0);
  const [quizMode, setQuizMode] = useState(0);
  const [quizPage, setQuizPage] = useState(0);
  const [user, setUser] = useState(null);
  const [myClass, setMyClass] = useState(null);
  const { userId, username, setUsername, rank, setRank, xp, setXp, totalscore, setTotalscore } = useUser(); // Correctly deconstruct all the required values

  useEffect(() => {
    if (userId) {
      const docRef = doc(db, 'et4s_main', userId); // Document ID

      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser(userData);
          setMyClass(userData.class);
          setUsername(userData.name);
          setRank(userData.rank);
          setXp(userData.xp);
          setTotalscore(userData.totalscore);
        } else {
          console.log('Cannot Find User!');
        }
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [userId, setUsername, setRank, setXp, setTotalscore]);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleQuizPage = (newQuiz) => {
    setQuizMode(1);
    setQuizPage(newQuiz);
  };

  const handleEnding = () => {
    setQuizMode(0);
    setPage(1);
  };

  if (quizMode === 0) {
    return (
      <div className="main-container">
        <Header />
        <MiniDrawer setPage={handleChangePage} curPage={curPage} />
        <div className="content w-fill">
          {curPage === 0 && (
            <React.StrictMode>
              <Home handleChangePage={handleChangePage}/>
            </React.StrictMode>
          )}
          {curPage === 1 && myClass === 'A' && (
            <React.StrictMode>
              <br />
              <MissionPlanetHopper setQuizPage={handleQuizPage} />
            </React.StrictMode>
          )}
          {curPage === 2 && (
            <React.StrictMode>
              <br />
              <App2 />
            </React.StrictMode>
          )}
          {curPage === 1 && myClass === 'B' && (
            <React.StrictMode>
              <br />
              <MissionPlanetHopper2 setQuizPage={handleQuizPage} />
            </React.StrictMode>
          )}
        </div>
        <Footer />
      </div>
    );
  } else if (quizMode === 1) {
    return (
      <div>
        {quizPage === 0 && (
          <React.StrictMode>
            <A_MCQPage handleEnding={handleEnding} />
          </React.StrictMode>
        )}
        {quizPage === 1 && (
          <React.StrictMode>
            <DndProvider backend={HTML5Backend}>
              <A_DndPage handleEnding={handleEnding} />
            </DndProvider>
          </React.StrictMode>
        )}
        {quizPage === 2 && (
          <React.StrictMode>
            <br />
            <A_MatchPage handleEnding={handleEnding} />
          </React.StrictMode>
        )}
        {quizPage === 4 && (
          <React.StrictMode>
            <br />
            <B_MCQPage handleEnding={handleEnding} />
          </React.StrictMode>
        )}
        {quizPage === 5 && (
        <React.StrictMode>
            <DndProvider backend={HTML5Backend}>
            <B_DndPage handleEnding={handleEnding} />
          </DndProvider>
        </React.StrictMode>
        )}
        {quizPage === 6 && (
          <React.StrictMode>
            <br />
            <B_MatchPage handleEnding={handleEnding} />
          </React.StrictMode>
        )}
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();






