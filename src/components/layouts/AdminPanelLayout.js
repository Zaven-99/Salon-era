import HeaderAdminPanel from "../../components/admin/headerAdminPanel/HeaderAdminPanel";

const AdminPanelLayout = ({ children }) => {
  
  return (
    <div>
      <HeaderAdminPanel />
      <main>{children}</main>
    </div>
  );
};

export default AdminPanelLayout;
