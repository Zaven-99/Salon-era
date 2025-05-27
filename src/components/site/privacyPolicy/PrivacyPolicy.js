import React, {useEffect} from "react";
import AOS from "aos"; // импортируем AOS

import styles from "./privacyPolicy.module.scss";

const PrivacyPolicy = () => {

  useEffect(() => {
      AOS.init({
        duration: 1000,
        once: false,
        offset: 100,
      });
    }, []);
  return (
    <div className={styles["privacy-policy"]}>
      <header data-aos="fade-zoom-in">
        <h1 className={styles.title}>Политика конфиденциальности</h1>
      </header>

      <section data-aos="fade-zoom-in" className={styles.section}>
        <h2>1. Введение</h2>
        <p className={styles["privacy-paragraph"]}>
          Настоящая Политика конфиденциальности (далее — «Политика») объясняет,
          как мы, <strong>ЭРА</strong>, обрабатываем и защищаем персональные
          данные наших клиентов, которые предоставляются через наш веб-сайт,
          доступный по адресу <strong>www.salon-era.ru</strong>. Мы придаем
          большое значение защите ваших персональных данных и соблюдаем все
          применимые законы о защите данных.
        </p>
      </section>

      <section data-aos="fade-zoom-in" className={styles.section}>
        <h2>2. Сбор персональных данных</h2>
        <p className={styles["privacy-paragraph"]}>
          Мы можем собирать следующие персональные данные:
        </p>
        <ul>
          <li className={styles["privacy-marker"]}>
            Имя, фамилия, контактные данные (телефон, email);
          </li>
          <li className={styles["privacy-marker"]}>
            Данные о предпочтениях в услугах (например, тип стрижки, стиль
            укладки);
          </li>
          <li className={styles["privacy-marker"]}>
            Данные о посещении нашего сайта (например, IP-адрес, информация о
            браузере);
          </li>
          <li className={styles["privacy-marker"]}>
            Информация о бронированиях и посещениях нашего салона;
          </li>
          <li className={styles["privacy-marker"]}>
            Другие данные, которые могут быть предоставлены вами для
            использования наших услуг.
          </li>
        </ul>
      </section>

      <section data-aos="fade-zoom-in" className={styles.section}>
        <h2>3. Цели обработки персональных данных</h2>
        <p className={styles["privacy-paragraph"]}>
          Мы обрабатываем ваши персональные данные для следующих целей:
        </p>
        <ul>
          <li className={styles["privacy-marker"]}>
            Обработка и выполнение запросов на услуги;
          </li>
          <li className={styles["privacy-marker"]}>
            Обеспечение связи с вами по вопросам, связанным с вашими заказами и
            услугами;
          </li>
          <li className={styles["privacy-marker"]}>
            Улучшение качества обслуживания;
          </li>
          <li className={styles["privacy-marker"]}>
            Информирование о новинках, акциях и специальных предложениях (если
            вы дали согласие на получение таких уведомлений);
          </li>
          <li className={styles["privacy-marker"]}>
            Анализ и улучшение работы нашего сайта.
          </li>
        </ul>
      </section>

      <section data-aos="fade-zoom-in" className={styles.section}>
        <h2>4. Хранение данных</h2>
        <p className={styles["privacy-paragraph"]}>
          Ваши персональные данные хранятся в течение необходимого срока для
          выполнения вышеуказанных целей, а также в рамках установленных
          законодательством сроков хранения информации.
        </p>
      </section>

      <section data-aos="fade-zoom-in" className={styles.section}>
        <h2>5. Раскрытие данных</h2>
        <p className={styles["privacy-paragraph"]}>
          Мы не передаем ваши персональные данные третьим лицам, за исключением
          случаев, когда это необходимо для выполнения услуг (например, передача
          данных для онлайн-бронирования) или в соответствии с требованиями
          закона.
        </p>
      </section>

      <section data-aos="fade-zoom-in" className={styles.section}>
        <h2>6. Защита данных</h2>
        <p className={styles["privacy-paragraph"]}>
          Мы применяем различные меры безопасности для защиты ваших персональных
          данных от несанкционированного доступа, использования, изменения или
          уничтожения. Однако следует понимать, что передача данных через
          интернет не может быть абсолютно безопасной, и мы не можем
          гарантировать полную защиту информации.
        </p>
      </section>

      <section data-aos="fade-zoom-in" className={styles.section}>
        <h2>7. Ваши права</h2>
        <p className={styles["privacy-paragraph"]}>Вы имеете право:</p>
        <ul>
          <li className={styles["privacy-marker"]}>
            Запрашивать доступ к вашим персональным данным;
          </li>
          <li className={styles["privacy-marker"]}>
            Исправлять или обновлять ваши персональные данные;
          </li>
          <li className={styles["privacy-marker"]}>
            Запрашивать удаление ваших персональных данных, если они больше не
            нужны для целей обработки;
          </li>
          <li className={styles["privacy-marker"]}>
            Отозвать согласие на обработку данных (в случае, если обработка
            осуществляется на основе вашего согласия).
          </li>
        </ul>
        <p className={styles["privacy-paragraph"]}>
          Для осуществления этих прав, пожалуйста, свяжитесь с нами по
          контактным данным, указанным на сайте.
        </p>
      </section>

      <section data-aos="fade-zoom-in" className={styles.section}>
        <h2>8. Использование cookies</h2>
        <p className={styles["privacy-paragraph"]}>
          Наш сайт использует cookies для улучшения работы сайта и анализа
          взаимодействия с пользователями. Вы можете настроить ваш браузер таким
          образом, чтобы блокировать cookies, однако это может повлиять на
          функциональность сайта.
        </p>
      </section>

      <section data-aos="fade-zoom-in" className={styles.section}>
        <h2>9. Изменения в Политике конфиденциальности</h2>
        <p className={styles["privacy-paragraph"]}>
          Мы оставляем за собой право в любое время изменять или обновлять
          настоящую Политику. Все изменения будут опубликованы на этой странице
          с указанием даты последнего обновления.
        </p>
      </section>

      <footer data-aos="fade-zoom-in">
        <p className={styles["privacy-paragraph"]}>
          <strong>Дата последнего обновления:</strong> 27.05.2025г.
        </p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
