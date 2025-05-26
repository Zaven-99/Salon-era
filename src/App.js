import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, removeUser } from "./store/slices/userSlice";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import MainPage from "./pages/mainPage/MainPage";
import OurWorksPage from "./pages/ourWorksPage/OurWorksPage";
import AboutUsPage from "./pages/aboutUsPage/AboutUsPage";
import BarbersPage from "./pages/barbersPage/BarbersPage";
import OrdersAdminPanelPage from "./pages/ordersAdminPanelPage/OrdersAdminPanelPage";
import ServicesAdminPanelPage from "./pages/servicesAdminPanelPage/ServicesAdminPanelPage";
import EmployeeAdminPanelPage from "./pages/employeeAdminPanelPage/EmployeeAdminPanelPage";
import MyRecordsPage from "./pages/myRecordsPage/MyRecordsPage";
import HistoryOrdersAdminPanelPage from "./pages/historyOrdersAdminPanelPage/HistoryOrdersAdminPanelPage";
import DatePage from "./pages/datePage/DatePage";
import OurWorksAdminPanelPage from "./pages/ourWorksAdminPanelPage/OurWorksAdminPanelPage";
import NewsAdminPanelPage from "./pages/newsAdminPanelPage/NewsAdminPanelPage";
import ScheduleAdminPanelPage from "./pages/scheduleAdminPanelPage/ScheduleAdminPanelPage";
import PrivacyPolicyPage from "./pages/privacyPolicyPage/PrivacyPolicyPage";
import SlidesAdminPanelPage from "./pages/slidesAdminPanelPage/SlidesAdminPanelPage";
import AdminPanelLayout from "./components/layouts/AdminPanelLayout";
import spinner from "./img/icons/Loading_icon.gif";
import CustomButton from "./components/customButton/CustomButton";
import "./App.css";

import "./components/styles/reset.css";
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
        const res = await fetch(
          "https://api.salon-era.ru/test/bearer/getdata",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (res.status === 401) {
          console.warn("❌ Сессия истекла, выполняется очистка");

          setSessionExpired(true);

          // Остановить дальнейшие проверки
          clearInterval(intervalId);
        }
      } catch (e) {
        console.error("Ошибка при проверке сессии:", e);
      }
    };

    // ⏱ Первая проверка через 5 минут
    timeoutId = setTimeout(() => {
      checkSession();

      // ⏱ Далее — каждые 8 минут
      intervalId = setInterval(() => {
        checkSession();
      }, 8 * 60 * 1000); // 8 минут
    }, 5 * 60 * 1000); // 5 минут

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
        <div className="modal-overlay">
          <div className="modal-content">
            <img className="spinner" src={spinner} alt="" />
            <p>Сессия истекла. Пожалуйста, войдите снова.</p>
            <CustomButton
              label="Ок"
              onClick={handleSessionExpiredConfirm}
              className="b-btn"
            />
          </div>
        </div>
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

        <Route
          path="/adminPanel/orders"
          element={
            <AdminPanelLayout>
              <OrdersAdminPanelPage />
            </AdminPanelLayout>
          }
        />
        <Route
          path="/adminPanel/news"
          element={
            <AdminPanelLayout>
              <NewsAdminPanelPage />
            </AdminPanelLayout>
          }
        />
        <Route
          path="/adminPanel/services"
          element={
            <AdminPanelLayout>
              <ServicesAdminPanelPage />
            </AdminPanelLayout>
          }
        />
        <Route
          path="/adminPanel/employee"
          element={
            <AdminPanelLayout>
              <EmployeeAdminPanelPage />
            </AdminPanelLayout>
          }
        />
        <Route
          path="/adminPanel/history-orders"
          element={
            <AdminPanelLayout>
              <HistoryOrdersAdminPanelPage />
            </AdminPanelLayout>
          }
        />
        <Route
          path="/adminPanel/our-works"
          element={
            <AdminPanelLayout>
              <OurWorksAdminPanelPage />
            </AdminPanelLayout>
          }
        />
        <Route
          path="/adminPanel/slides"
          element={
            <AdminPanelLayout>
              <SlidesAdminPanelPage />
            </AdminPanelLayout>
          }
        />
        <Route
          path="/adminPanel/schedule"
          element={
            <AdminPanelLayout>
              <ScheduleAdminPanelPage />
            </AdminPanelLayout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
