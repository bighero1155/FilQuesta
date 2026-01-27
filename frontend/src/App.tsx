import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import UserManagement from "./components/Users/UserManagement";
import Login from "./pages/Login";
import Register from "./components/Users/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import HumanBodySystemsGame from "./humanbodygame/HumanBodySystemsGame";
import Intro from "./pages/Intro";
import StudentProfile from "./pages/StudentProfile";
import FirstPage from "./pages/firstpage";
import PhaserGame from "./WordWizard/GameCaller";
import Map from "./WordWizard/Map";
import Dashboard from "./components/Users/Dashboard";
import QuizDashboard from "./components/Quizzes/QuizDashboard";
import SharedQuizResults from "./components/Quizzes/SharedQuizResults";
import SharedQuizQuest from "./components/Quizzes/SharedQuizQuest";
import SharedQuizLobby from "./components/Quizzes/SharedQuizLobby";
import MagicTreeGame from "./MagicTree/MagicTreeGame";
import MagicTreeMap from "./MagicTree/MagicTreeMap";
import "./styles/responsive.css";
import HistoryPortalGame from "./HistoryPortal/PhaserGame";
import HistoryMap from "./HistoryPortal/HistoryMap";
import CreateClassroomPage from "./components/Classroom/CreateClassroomPage";
import ClassroomPage from "./components/Classroom/ClassroomPage";
import SciencePage from "./subjects/SciencePage";
import MathematicsPage from "./subjects/MathematicsPage";
import EnglishPage from "./subjects/EnglishPage";
import AralingPanlipunanPage from "./subjects/AralingPanlipunanPage";
import RecommendationWidget from "./components/Classroom/RecommendationWidget";
import CosmeticsPage from "./components/Cosmetics/CosmeticsPage";
import CosmeticsShop from "./components/Cosmetics/CosmeticsShop";
import PowerUpShop from "./components/Powerups/PowerUpShop";
import AdminDashboard from "./Admin/AdminDashboard";
import SharedQuizReview from "./components/Quizzes/SharedQuizReview";
import TeacherQuizReview from "./components/Quizzes/TeacherQuizReview";
import HumanBodyMap from "./humanbodygame/HumanBodyMap";

// ---------------------------
// PIXELATED LOADING SCREEN
// ---------------------------
const Loading: React.FC = () => {
  const styles: Record<string, React.CSSProperties> = {
    screen: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(26, 26, 26, 0.95)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      fontFamily: "'Press Start 2P', monospace",
      color: "#00ffcc",
      imageRendering: "pixelated",
      flexDirection: "column",
      textAlign: "center",
    },
    loader: {
      display: "flex",
      gap: "6px",
      marginBottom: "20px",
    },
    pixel: {
      width: "20px",
      height: "20px",
      backgroundColor: "#00ffcc",
      animation: "blink 1s infinite",
      imageRendering: "pixelated",
    },
    text: {
      fontSize: "14px",
      color: "#00ffcc",
      textShadow: "0 0 6px #00ffcc",
    },
  };

  const styleTag = `
    @keyframes blink {
      0%, 100% { opacity: 0.2; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.3); }
    }
  `;

  return (
    <>
      <style>{styleTag}</style>
      <div style={styles.screen}>
        <div style={styles.loader}>
          <div style={{ ...styles.pixel, animationDelay: "0s" }} />
          <div style={{ ...styles.pixel, animationDelay: "0.2s" }} />
          <div style={{ ...styles.pixel, animationDelay: "0.4s" }} />
          <div style={{ ...styles.pixel, animationDelay: "0.6s" }} />
        </div>
        <p style={styles.text}>Loading...</p>
      </div>
    </>
  );
};

// ---------------------------
// ROUTER
// ---------------------------
const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/users",
    element: (
      <ProtectedRoute allowedRoles={["teacher", "admin"]}>
        <>
          <Navbar />
          <UserManagement />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/landing",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <>
          <LandingPage />
          <RecommendationWidget /> 
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <StudentProfile />
      </ProtectedRoute>
    ),
  },
  { path: "/intro", element: <Intro /> },
  { path: "/", element: <FirstPage /> },
  { path: "*", element: <NotFound /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <>
          <Navbar />
          <Dashboard />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/QuizDashboard",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <>
          <Navbar />
          <QuizDashboard />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/sharedquiz/:code/lobby",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <SharedQuizLobby />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sharedquiz/:code/quiz",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <SharedQuizQuest />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sharedquiz/:code/results",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <SharedQuizResults />
      </ProtectedRoute>
    ),
  },
  {
    path: "/CreateClassroom",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <>
          <Navbar />
          <CreateClassroomPage />
        </>
      </ProtectedRoute> 
    ),
  },
  {
    path: "/Classroom",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <>
          <ClassroomPage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/Admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <>
          <AdminDashboard />
        </>
      </ProtectedRoute>
    ),
  },
  {
  path: "/shared-quiz/:code/review",  
  element: (
    <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
      <SharedQuizReview />
    </ProtectedRoute>
  ),
},
{
  path: "/teacher/shared-quiz-review/:sessionId/:studentId", 
  element: (
    <ProtectedRoute allowedRoles={["teacher","student", "admin"]}>
      <TeacherQuizReview />
    </ProtectedRoute>
  ),
},

  //subjects
  {
    path: "/Science",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <>
          <SciencePage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/Mathematics",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <>
          <MathematicsPage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/English",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <>
          <EnglishPage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/AralingPanlipunan",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <>
          <AralingPanlipunanPage />
        </>
      </ProtectedRoute>
    ),
  },

  //below is for games my boi

  {
    path: "/historymap",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <HistoryMap />
      </ProtectedRoute>
    ),
  },
  {
    path: "/history-portal",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <HistoryPortalGame />
      </ProtectedRoute>
    ),
  },
  {
    path: "/MagicTree",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <MagicTreeMap />
      </ProtectedRoute>
    ),
  },
  {
    path: "/magictreescene",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <MagicTreeGame />
      </ProtectedRoute>
    ),
  },
  {
    path: "/wordwizard",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <PhaserGame />
      </ProtectedRoute>
    ),
  },
  {
    path: "/wordwizardmap",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <Map />
      </ProtectedRoute>
    ),
  },
  {
  path: "/humanbodymap",
  element: (
    <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
      <HumanBodyMap />
    </ProtectedRoute>
  ),
},
{
  path: "/body-systems",
  element: (
    <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
      <HumanBodySystemsGame />
    </ProtectedRoute>
  ),
},
  {
    path: "/map-scene/:chapterId",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <HumanBodySystemsGame />
      </ProtectedRoute>
    ),
  },

  {
    path: "/cosmetics",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <CosmeticsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cosmeticshop",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <CosmeticsShop />
      </ProtectedRoute>
    ),
  },
  {
    path: "/powerupshop",
    element: (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <PowerUpShop />
      </ProtectedRoute>
    ),
  },
]);

// ---------------------------
// APP COMPONENT - FIXED
// ---------------------------
const App: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 300);

    const handleApiLoading = (e: Event) => {
      const customEvent = e as CustomEvent<{ isLoading: boolean }>;
      setApiLoading(customEvent.detail.isLoading);
    };

    window.addEventListener("apiLoading", handleApiLoading);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("apiLoading", handleApiLoading);
    };
  }, []);

  return (
    <>
      {(initialLoading || apiLoading) && <Loading />}
      {!initialLoading && <RouterProvider router={router} />}
    </>
  );
};


export default App;