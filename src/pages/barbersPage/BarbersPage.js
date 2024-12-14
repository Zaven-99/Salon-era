import React from "react";
import Header from "../../components/site/header/Header";
import Footer from "../../components/site/footer/Footer";
import ServicesSection from "../../components/site/servicesSection/ServicesSection";
import ChooseABarbers from "../../components/site/signUpForAHaircut/chooseABarbers/ChooseABarbers";
import NewsBlock from "../../components/site/newBlock/newsBlock";

const BarbersPage = () => {
  return (
    <div>
      <Header />
      <ServicesSection />
      <ChooseABarbers />
      <NewsBlock/>
      <Footer />
    </div>
  );
};

export default BarbersPage;
