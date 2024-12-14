import React from 'react';
import HeaderAdminPanel from "../../components/admin/headerAdminPanel/HeaderAdminPanel";
import EditEmployee from "../../components/admin/editEmployee/EmployeeField";


const EmployeeAdminPanelPage = () => {
	return (
		<div>
			<HeaderAdminPanel/>
			<EditEmployee/>
		</div>
	);
};

export default EmployeeAdminPanelPage;