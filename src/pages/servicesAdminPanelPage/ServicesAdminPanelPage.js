import React from 'react';
import HeaderAdminPanel from "../../components/admin/headerAdminPanel/HeaderAdminPanel";
import EditService from "../../components/admin/editService/ServicesField";

const ServicesAdminPanel = () => {
	return (
    <div>
      <HeaderAdminPanel/>
      <EditService/>
    </div>
  );
};

export default ServicesAdminPanel;