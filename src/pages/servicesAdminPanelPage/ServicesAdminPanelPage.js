import React from 'react';
import HeaderAdminPanel from "../../components/admin/headerAdminPanel/HeaderAdminPanel";
import ServicesField from "../../components/admin/services/ServicesField";

const ServicesAdminPanel = () => {
	return (
    <div>
      <HeaderAdminPanel />
      <ServicesField />
    </div>
  );
};

export default ServicesAdminPanel;