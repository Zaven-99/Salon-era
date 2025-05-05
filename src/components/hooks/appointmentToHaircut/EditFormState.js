import { useForm } from "react-hook-form";
 
export const useEditFormState = ({

  setLoading,
  editedClient,
  setEditedClient,
  setClientId,
  activeInput,
  setActiveInput,
 
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    setLoading(true);
    const serviceToUpdate = { ...editedClient, id };

    const formData = new FormData();
    formData.append(
      "clientData",
      JSON.stringify({
        ...serviceToUpdate,
        patronymic: null,
        login: null,
        password: null,
        dateBirthday: null,
        dateWorkIn: null,
        dateWorkOut: null,
        position: null,
        description: null,
      })
    );

    try {
      const response = await fetch(`https://api.salon-era.ru/clients/update`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Ошибка при сохранении: ${errorMessage}`);
      }

      setClientId(null);
      setEditedClient({});
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return {
    editedClient,
    setEditedClient,
    activeInput,
    setActiveInput,
   
    setClientId,
    register,
    control,
    errors,
    handleChange,
    handleSave,
  };
};
