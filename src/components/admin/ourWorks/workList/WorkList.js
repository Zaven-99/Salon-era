import React, { useEffect, useState } from "react";
import CustomButton from "../../../customButton/CustomButton";

import styles from "./workList.module.scss";
import Spinner from '../../../spinner/Spinner';

const WorkList = ({ setWorks, categoryMap }) => {
  const [groupedWorks, setGroupedWorks] = useState({});
  const [workToDelete, setWorkToDelete] = useState(null);
  const [confirmDeleteWork, setConfirmDeleteWork] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const getCategpryText = (category) => {
    if (category >= 1 && category <= categoryMap.length) {
      return categoryMap[category - 1];
    } else {
      return "Неизвестная позиция";
    }
  };

  const fetchWorks = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://95.163.84.228:6533/stockfiles/all");

      if (!response.ok) throw new Error("Ошибка при получении сотрудников");
      const data = await response.json();
      setWorks(data);

      const grouped = data.reduce((acc, work) => {
        const category = getCategpryText(work.category);
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(work);
        return acc;
      }, {});

      setGroupedWorks(grouped);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     (async () => {
       await fetchWorks();
     })();
   }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    if (workToDelete === null) return;
    try {
      const response = await fetch(
        `http://95.163.84.228:6533/stockfiles?id=${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Ошибка при удалении услуги");
      setWorks((prevWorks) => prevWorks.filter((work) => work.id !== id));
      closeMessageDeleteWork()
    } catch (error) {
    } finally {
      setLoading(false);
      window.location.reload();
      
     }
  };

  const showMessageDeleteWork = (id) => {
    setWorkToDelete(id);
    setConfirmDeleteWork(true);
    document.body.style.overflow = "hidden";
  };

  const closeMessageDeleteWork = () => {
    setWorkToDelete(null);
    setConfirmDeleteWork(false);
    document.body.style.overflow = "scroll";
  };

  if(loading){
    return <Spinner/>
  }

  return (
    <div className={styles['work-list']}>
      {Object.entries(groupedWorks).map(
        ([category, worksInCategory], index) => (
          <div key={index}>
            <h3>{category}</h3>
            <div className={styles["grid-container"]}>
              {worksInCategory.map((work, index) => (
                <div key={index} className={styles["grid-item"]}>
                  <div>
                    <img src={work.imageLink} alt="" />
                  </div>

                  <CustomButton
                    label="Удалить работу"
                    type="button"
                    className={styles["delete-work"]}
                    onClick={() => showMessageDeleteWork(work.id)}
                  />

                  <div>
                    {confirmDeleteWork && workToDelete === work.id && (
                      <div className={styles["modal-overlay"]}>
                        <div className={styles["modal-content"]}>
                          <h2>Вы действительно хотите удалить работу ?</h2>

                          <div className={styles["btn-block"]}>
                            <CustomButton
                              className={styles["acceptDelete-work"]}
                              type="button"
                              label="Удалить работу"
                              onClick={() => handleDelete(work.id)}
                            />
                            <CustomButton
                              className={styles["cancelDelete-work"]}
                              type="button"
                              label="Отменить удаления"
                              onClick={closeMessageDeleteWork}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default WorkList;
