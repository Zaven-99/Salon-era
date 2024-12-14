import React from 'react';
import HeaderAdminPanel from "../../components/admin/headerAdminPanel/HeaderAdminPanel";
import HistoryOrders from "../../components/admin/historyOrders/HistoryOrders";



const HistoryOrdersAdminPanelPage = () => {
	return (
    <div>
      <HeaderAdminPanel />
	  <HistoryOrders/>
    </div>
  );
};

export default HistoryOrdersAdminPanelPage;