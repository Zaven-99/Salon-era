import React from "react";

import Header from "../../components/site/header/Header";
import Main from "../../components/site/main/Main";
import NewsBlock from "../../components/site/newBlock/newsBlock";
import Footer from "../../components/site/footer/Footer";

const MainPage = ({
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
      <Main toggleOpen={toggleOpen} />
      <NewsBlock />
      <Footer />
    </div>
  );
};

export default MainPage;
