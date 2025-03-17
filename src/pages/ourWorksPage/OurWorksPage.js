import React from 'react';
import Header from "../../components/site/header/Header";
import Footer from "../../components/site/footer/Footer";
import OurWorks from "../../components/site/ourWorks/OurWorks";

const OurWorksPage = ({
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
      <OurWorks />
      <Footer />
    </div>
  );
};

export default OurWorksPage;