import React from 'react';
import HeaderAdminPanel from "../../components/admin/headerAdminPanel/HeaderAdminPanel";
import Schedule from '../../components/admin/schedule/Schedule';

const ScheduleAdminPanelPage = () => {
	return (
    <div>
      <HeaderAdminPanel />
	    <Schedule/>
    </div>
  );
};

export default ScheduleAdminPanelPage;