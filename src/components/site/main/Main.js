import React from "react";
import { useAuth } from "../../../use-auth/use-auth";
import ServicesSection from "../servicesSection/ServicesSection";
import SignUpForAHaircut from "../signUpForAHaircut/SignUpForAHaircut";

import styles from "./main.module.scss";

const Main = ({ toggleOpenSignInForm }) => {
  const { token } = useAuth();

  const handleSignUpClick = () => {
    if (!token) {
      toggleOpenSignInForm();
    }
  };

  return (
    <main className={styles.main}>
      <ServicesSection />

    
      <SignUpForAHaircut  handleSignUpClick={handleSignUpClick} />
    </main>
  );
};

export default Main;
