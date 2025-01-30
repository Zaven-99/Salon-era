import React from "react";
import HeaderAdminPanel from "../../components/admin/headerAdminPanel/HeaderAdminPanel";
import WorksField from "../../components/admin/editWorks/WorksField";

const ourWorksAdminPanelPage = () => {
  return (
    <div>
      <HeaderAdminPanel />
      <WorksField />
    </div>
  );
};

export default ourWorksAdminPanelPage;
