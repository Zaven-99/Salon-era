import { useState } from "react";

export const EditModalState = ({
  editedService,
  setEditedService,
  setLoading,
  setServices,
  setServiceId,
  toggleClose,
  reset,
}) => {
  const [activeInput, setActiveInput] = useState("");

  const handleSave = async (id) => {
    setLoading(true);

    const serviceToUpdate = { ...editedService, id };
    const formData = new FormData();
    formData.append(
      "clientData",
      JSON.stringify({
        ...serviceToUpdate,
      })
    );

    try {
      const response = await fetch(`https://api.salon-era.ru/services/update`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Ошибка при сохранении услуги");

      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === id ? editedService : service
        )
      );
      setServiceId(null);
      setEditedService({});
      toggleClose();
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedService((prev) => ({ ...prev, [name]: value }));
  };

  return {
    activeInput,
    setActiveInput,
    handleSave,
    handleChange,
  };
};
