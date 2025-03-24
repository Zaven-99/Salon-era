import React from "react";
import HeaderAdminPanel from "../../components/admin/headerAdminPanel/HeaderAdminPanel";
import EmployeeField from "../../components/admin/employee/EmployeeField";

const EmployeeAdminPanelPage = () => {
  return (
    <div>
      <HeaderAdminPanel />
      <EmployeeField />
    </div>
  );
};

export default EmployeeAdminPanelPage;
