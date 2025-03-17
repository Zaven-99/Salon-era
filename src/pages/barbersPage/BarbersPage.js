import React from "react";
import Header from "../../components/site/header/Header";
import Footer from "../../components/site/footer/Footer";
import ServicesSection from "../../components/site/servicesSection/ServicesSection";
import ChooseABarbers from "../../components/site/signUpForAHaircut/chooseABarbers/ChooseABarbers";
import NewsBlock from "../../components/site/newBlock/newsBlock";
import { useAuth } from "../../use-auth/use-auth";

const BarbersPage = ({
  openSignInForm,
  isClosing,
  setIsClosing,
  toggleOpen,
  toggleClose,
}) => {
const { token } = useAuth();

  const handleSignUpClick = () => {
    if (!token) {
      toggleOpen();
    }
  };
  return (
    <div>
      <Header
        openSignInForm={openSignInForm}
        isClosing={isClosing}
        setIsClosing={setIsClosing}
        toggleOpen={toggleOpen}
        toggleClose={toggleClose}
      />
      <ServicesSection />
      <ChooseABarbers handleSignUpClick={handleSignUpClick} />
      <NewsBlock />
      <Footer />
    </div>
  );
};

export default BarbersPage;
