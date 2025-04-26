import React from "react";
import ServicesSection from "../servicesSection/ServicesSection";
import SignUpForAHaircut from "../signUpForAHaircut/SignUpForAHaircut";

import styles from "./main.module.scss";

const Main = () => {
  return (
    <main className={styles.main}>
      <ServicesSection />
      <SignUpForAHaircut />
    </main>
  );
};

export default Main;
