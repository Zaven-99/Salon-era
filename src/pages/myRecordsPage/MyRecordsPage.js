import React from 'react';
import Header from "../../components/site/header/Header";
import MyRecords from "../../components/site/myRecords/MyRecords";

const MyOrdersPage = ({
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
      <MyRecords />
    </div>
  );
};

export default MyOrdersPage;