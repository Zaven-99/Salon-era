import React from "react";

import Header from "../../components/site/header/Header";
import Main from "../../components/site/main/Main";
import NewsBlock from "../../components/site/newBlock/newsBlock";
import Footer from "../../components/site/footer/Footer";

const MainPage = ({
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
      <Main toggleOpenSignInForm={toggleOpenSignInForm} />
      <NewsBlock />
      <Footer />
    </div>
  );
};

export default MainPage;
