import React from "react";

import Header from "../../components/site/header/Header";
import Main from "../../components/site/main/Main";
import NewsBlock from "../../components/site/newBlock/newsBlock";
import Footer from "../../components/site/footer/Footer";

const MainPage = () => {
  return (
    <div>
      <Header  />
      <Main />
      <NewsBlock/>
      <Footer />
    </div>
  );
};

export default MainPage;
