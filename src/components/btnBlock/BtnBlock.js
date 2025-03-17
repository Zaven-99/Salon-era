import React from "react";
import CustomButton from "../customButton/CustomButton";

const BtnBlock = ({
  className1,
  className2,
  className3,
  fnc1,
  fnc2,
  label1,
  label2,
}) => {
  return (
    <div className={className3}>
      <CustomButton className={className1} onClick={fnc1} label={label1} />
      <CustomButton className={className2} label={label2} onClick={fnc2} />
    </div>
  );
};

export default BtnBlock;
