import React from "react";
import HeaderAdminPanel from "../../components/admin/headerAdminPanel/HeaderAdminPanel";
import Orders from "../../components/admin/orders/Orders";

const OrdersAdminPanelPage = () => {
  return (
    <div>
      <HeaderAdminPanel />
      <Orders />
    </div>
  );
};

export default OrdersAdminPanelPage;
