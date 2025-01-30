import React from "react";
import Header from "../../components/site/header/Header";
import Footer from "../../components/site/footer/Footer";
import ServicesSection from "../../components/site/servicesSection/ServicesSection";
import ChooseABarbers from "../../components/site/signUpForAHaircut/chooseABarbers/ChooseABarbers";
import NewsBlock from "../../components/site/newBlock/newsBlock";

const BarbersPage = ({
  openSignInForm,
  isClosing,
  setIsClosing,
  toggleOpenSignInForm,
  toggleCloseSignInForm,
}) => {
  return (
    <div>
      <Header
        openSignInForm={openSignInForm}
        isClosing={isClosing}
        setIsClosing={setIsClosing}
        toggleOpenSignInForm={toggleOpenSignInForm}
        toggleCloseSignInForm={toggleCloseSignInForm}
      />
      <ServicesSection />
      <ChooseABarbers />
      <NewsBlock />
      <Footer />
    </div>
  );
};

export default BarbersPage;
