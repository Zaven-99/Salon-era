import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, removeUser } from "./store/slices/userSlice";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MainPage from "./pages/mainPage/MainPage";
import OurWorksPage from "./pages/ourWorksPage/OurWorksPage";
import AboutUsPage from "./pages/aboutUsPage/AboutUsPage";
import BarbersPage from "./pages/barbersPage/BarbersPage";
import MyRecordsPage from "./pages/myRecordsPage/MyRecordsPage";
import DatePage from "./pages/datePage/DatePage";
import PrivacyPolicyPage from "./pages/privacyPolicyPage/PrivacyPolicyPage";
import "./App.css";

import "./components/styles/reset.css";
import NotFoundPage from "./pages/notFound/NotFoundPage";
import SessionExpired from "./components/sessionExpired/SessionExpired";
function App() {
  const dispatch = useDispatch();
  const [openSignInForm, setOpenSignInForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  const toggleOpen = () => {
    setIsClosing(false);
    setOpenSignInForm(true);
    document.body.style.overflow = "hidden";
  };
  const toggleClose = () => {
    document.body.style.overflow = "scroll";
    setTimeout(() => {
      setOpenSignInForm(false);
    }, 500);
    setIsClosing(true);
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      dispatch(setUser(savedUser));
    }
  }, [dispatch]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    let timeoutId;
    let intervalId;

    const checkSession = async () => {
      try {
        const res = await fetch(`https://api.salon-era.ru/authentications/me`, {
          method: "GET",
          credentials: "include",
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
          if (body && body.errorCode === "105") {
            console.warn("❌ Сессия истекла, выполняется очистка");
            setSessionExpired(true);
            clearInterval(intervalId);
          } else {
            console.error(
              "Ошибка при проверке сессии:",
              body || res.statusText
            );
          }
        } else {
          if (body && body.errorCode === "105") {
            console.warn("❌ Сессия истекла, выполняется очистка");
            setSessionExpired(true);
            clearInterval(intervalId);
          }
        }
      } catch (e) {
        console.error("Ошибка при проверке сессии:", e);
      }
    };

    timeoutId = setTimeout(() => {
      checkSession();

      intervalId = setInterval(() => {
        checkSession();
      }, 8 * 60 * 1000);
    }, 5 * 60 * 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  const handleSessionExpiredConfirm = () => {
    localStorage.removeItem("user");
    dispatch(removeUser());
    setSessionExpired(false);
    navigate("/");
  };

  return (
    <div className="App">
      {sessionExpired && (
        <SessionExpired
          handleSessionExpiredConfirm={handleSessionExpiredConfirm}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              openSignInForm={openSignInForm}
              isClosing={isClosing}
              setIsClosing={setIsClosing}
              toggleOpen={toggleOpen}
              toggleClose={toggleClose}
            />
          }
          index
        />
        <Route
          path="/ourWorks"
          element={
            <OurWorksPage
              openSignInForm={openSignInForm}
              isClosing={isClosing}
              setIsClosing={setIsClosing}
              toggleOpen={toggleOpen}
              toggleClose={toggleClose}
            />
          }
        />
        <Route
          path="/aboutUs"
          element={
            <AboutUsPage
              openSignInForm={openSignInForm}
              isClosing={isClosing}
              setIsClosing={setIsClosing}
              toggleOpen={toggleOpen}
              toggleClose={toggleClose}
            />
          }
        />

        <Route
          path="/my-orders"
          element={
            <MyRecordsPage
              openSignInForm={openSignInForm}
              isClosing={isClosing}
              setIsClosing={setIsClosing}
              toggleOpen={toggleOpen}
              toggleClose={toggleClose}
            />
          }
        />
        <Route
          path="/select-barbers"
          element={
            <BarbersPage
              openSignInForm={openSignInForm}
              isClosing={isClosing}
              setIsClosing={setIsClosing}
              toggleOpen={toggleOpen}
              toggleClose={toggleClose}
            />
          }
        />
        <Route
          path="/select-barbers/select-date"
          element={
            <DatePage
              openSignInForm={openSignInForm}
              isClosing={isClosing}
              setIsClosing={setIsClosing}
              toggleOpen={toggleOpen}
              toggleClose={toggleClose}
            />
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PrivacyPolicyPage
              openSignInForm={openSignInForm}
              isClosing={isClosing}
              setIsClosing={setIsClosing}
              toggleOpen={toggleOpen}
              toggleClose={toggleClose}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
