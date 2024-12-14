import React from 'react';
import Header from '../../components/site/header/Header';
import Footer from "../../components/site/footer/Footer";
import ServicesSection from "../../components/site/servicesSection/ServicesSection";
import ChooseDate from "../../components/site/signUpForAHaircut/ChooseDate/ChooseDate";
import NewsBlock from '../../components/site/newBlock/newsBlock'


const DatePage = () => {
	return (
    <div>
      <Header />
      <ServicesSection/>
	    <ChooseDate/>
      <NewsBlock/>
      <Footer />
    </div>
  );
};

export default DatePage;