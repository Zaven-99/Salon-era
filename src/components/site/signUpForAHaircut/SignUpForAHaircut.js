import React, { useState } from "react";
import ChooseABarbers from "./chooseABarbers/ChooseABarbers";
import ChooseAService from "./chooseASerivce/ChooseAService";
import ChooseDate from "./ChooseDate/ChooseDate";

const SignUpForAHaircut = () => {
  const [showDate, setShowDate] = useState(false);
  const [showBarbers, setShowBarbers] = useState(false);


  return (
    <div>
      {!showDate && !showBarbers && <ChooseAService />}
      {showBarbers || showDate ? (
        <span
          onClick={() => {
            setShowDate(false);
            setShowBarbers(false);
          }}
        >
          назад
        </span>
      ) : (
        ""
      )}
      {showBarbers && <ChooseABarbers />}
      {showDate && <ChooseDate />}
    </div>
  );
};

export default SignUpForAHaircut;
