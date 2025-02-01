import React, { useState, useEffect, useMemo } from "react";
import AOS from "aos"; // импортируем AOS

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

  useEffect(() => {
      AOS.init({
        duration: 1000,
        once: false,
        offset: 300,
      });
    }, []);

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
              src={item.imageLink || avatar}
              alt=""
              data-aos="fade-right"
            />
            <p data-aos="fade-right">{item.firstName}</p>
            <p data-aos="fade-right">{item.lastName}</p>
            <p data-aos="fade-right">{getPositionText(item.position)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Employee;
