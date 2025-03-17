import React from 'react';
import Header from "../../components/site/header/Header"
import Footer from '../../components/site/footer/Footer';
import AboutUs from '../../components/site/aboutUs/AboutUs';

const AboutUsPage = ({
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
      <AboutUs />
      <Footer />
    </div>
  );
};

export default AboutUsPage;