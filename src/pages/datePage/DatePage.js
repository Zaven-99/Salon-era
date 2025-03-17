import React from 'react';
import Header from '../../components/site/header/Header';
import Footer from "../../components/site/footer/Footer";
import ServicesSection from "../../components/site/servicesSection/ServicesSection";
import ChooseDate from "../../components/site/signUpForAHaircut/ChooseDate/ChooseDate";
import NewsBlock from '../../components/site/newBlock/newsBlock'


const DatePage = ({
  openSignInForm,
  isClosing,
  setIsClosing,
  toggleOpen,
  toggleClose,
}) => {
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
      <ChooseDate />
      <NewsBlock />
      <Footer />
    </div>
  );
};

export default DatePage;