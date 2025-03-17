import React from 'react';
import PrivacyPolicy from '../../components/site/privacyPolicy/PrivacyPolicy';
import Header from '../../components/site/header/Header';
import Footer from '../../components/site/footer/Footer';


const PrivacyPolicyPage = ({
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
      <PrivacyPolicy />
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;