import React from 'react';
import Header from "../../components/site/header/Header"
import Footer from '../../components/site/footer/Footer';
import AboutUs from '../../components/site/aboutUs/AboutUs';

const AboutUsPage = ({
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
      <AboutUs />
      <Footer />
    </div>
  );
};

export default AboutUsPage;