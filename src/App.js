import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./store/slices/userSlice";
import { Route, Routes } from "react-router-dom";

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
import PrivacyPolicyPage from "./pages/privacyPolicyPage/PrivacyPolicyPage";

import "./App.css";
import "./components/styles/reset.css";
import SlidesAdminPanelPage from "./pages/slidesAdminPanelPage/SlidesAdminPanelPage";
 function App() {
  const dispatch = useDispatch();
  const [openSignInForm, setOpenSignInForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const toggleOpenSignInForm = () => {
    setOpenSignInForm(true);
    document.body.style.overflow = "hidden";
    setIsClosing(false);
  };
  const toggleCloseSignInForm = () => {
    document.body.style.overflow = "scroll";
    setTimeout(() => {
      setOpenSignInForm(false);
    }, 100);
    setIsClosing(true);
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      dispatch(setUser(savedUser));
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              openSignInForm={openSignInForm}
              isClosing={isClosing}
              setIsClosing={setIsClosing}
              toggleOpenSignInForm={toggleOpenSignInForm}
              toggleCloseSignInForm={toggleCloseSignInForm}
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
              toggleOpenSignInForm={toggleOpenSignInForm}
              toggleCloseSignInForm={toggleCloseSignInForm}
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
              toggleOpenSignInForm={toggleOpenSignInForm}
              toggleCloseSignInForm={toggleCloseSignInForm}
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
              toggleOpenSignInForm={toggleOpenSignInForm}
              toggleCloseSignInForm={toggleCloseSignInForm}
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
              toggleOpenSignInForm={toggleOpenSignInForm}
              toggleCloseSignInForm={toggleCloseSignInForm}
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
              toggleOpenSignInForm={toggleOpenSignInForm}
              toggleCloseSignInForm={toggleCloseSignInForm}
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
              toggleOpenSignInForm={toggleOpenSignInForm}
              toggleCloseSignInForm={toggleCloseSignInForm}
            />
          }
        />
        <Route path="/adminPanel/orders" element={<OrdersAdminPanelPage />} />
        <Route path="/adminPanel/news" element={<NewsAdminPanelPage />} />

        <Route
          path="/adminPanel/services"
          element={<ServicesAdminPanelPage />}
        />
        <Route
          path="/adminPanel/employee"
          element={<EmployeeAdminPanelPage />}
        />
        <Route
          path="/adminPanel/history-orders"
          element={<HistoryOrdersAdminPanelPage />}
        />
        <Route
          path="/adminPanel/history-orders"
          element={<HistoryOrdersAdminPanelPage />}
        />
        <Route
          path="/adminPanel/history-orders"
          element={<HistoryOrdersAdminPanelPage />}
        />
        <Route
          path="/adminPanel/our-works"
          element={<OurWorksAdminPanelPage />}
        />

        <Route path="/adminPanel/slides" element={<SlidesAdminPanelPage />} />
      </Routes>
    </div>
  );
}

export default App;
