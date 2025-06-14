import React from "react";
import { EmployeeState } from "../../hooks/masters/EmployeeState";
import styles from "./employee.module.scss";
import logo from "../../../img/logo.png";
import Spinner from "../../spinner/Spinner";
import avatar from "../../../img/icons/avatar.png";

const Employee = () => {
  const { filteredBarbers, getPositionTextById, loading } = EmployeeState();

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className={styles["employee-section"]}>
      <img className={styles.logo} src={logo} alt="" />
      <h1 data-aos="fade-right" className={styles["ours-professionals"]}>
        Наши профессионалы
      </h1>
      <div data-aos="zoom-in" className={styles["employees"]}>
        {filteredBarbers.map((item) => (
          <div key={item.id} className={styles.employee} data-aos="fade-right">
            <img
              className={styles["employee-img"]}
              src={item.image_link || avatar}
              alt=""
              data-aos="fade-right"
            />
            <p data-aos="fade-right">{item.first_name}</p>
            <p data-aos="fade-right">{item.last_name}</p>
            <p data-aos="fade-right">{getPositionTextById(item.position)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Employee;
