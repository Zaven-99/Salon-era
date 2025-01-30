import React, { useState, useEffect, useMemo } from "react";

import styles from "./employee.module.scss";
import logo from "../../../img/logo.png";
import Spinner from "../../spinner/Spinner";
import avatar from "../../../img/icons/avatar.png";

const Employee = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const positionMap = {
    1: "Женский парикмахер",
    2: "Мужской парикмахер",
    3: "Специалист по маникюру",
    4: "Бровист",
  };

  const getPositionText = (position) => positionMap[position];

  const fetchBarbers = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/clients/all");
      if (!response.ok) {
        throw new Error("Ошибка при получении барберов");
      }
      const data = await response.json();
      setBarbers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const filteredBarbers = useMemo(
    () => barbers.filter((barber) => barber.clientType === "employee"),
    [barbers]
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className={styles["employee-section"]}>
      <img className={styles.logo} src={logo} alt="" />
      <h1 className={styles["ours-professionals"]}>Наши профессионалы</h1>
      <div className={styles["employees"]}>
        {filteredBarbers.map((item) => (
          <div key={item.id} className={styles.employee}>
            <img
              className={styles["employee-img"]}
              src={item.imageLink || avatar}
              alt=""
            />
            <p>{item.firstName}</p>
            <p>{item.lastName}</p>
            <p>{getPositionText(item.position)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Employee;
