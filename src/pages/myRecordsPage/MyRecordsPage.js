import React from 'react';
import Header from "../../components/site/header/Header";
import MyRecords from "../../components/site/myRecords/MyRecords";

const MyOrdersPage = ({
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
      <MyRecords />
    </div>
  );
};

export default MyOrdersPage;