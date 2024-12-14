import React from "react";
import { useAuth } from "../../../use-auth/use-auth";
import ServicesSection from "../servicesSection/ServicesSection";
import SignUpForAHaircut from '../signUpForAHaircut/SignUpForAHaircut';

import styles from "./main.module.scss";

const Main = () => {
  const { token } = useAuth();

  return (
    <main className={styles.main}>
      <ServicesSection />
      
      {token ? <SignUpForAHaircut/> : ''}
    </main>
  );
};

export default Main;
