import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../../use-auth/use-auth";

export const FeedbackSectionState = ({
  setFeedbackText,
  setLoading,
  setFeedbacks,
  feedbacks,
  setRatings,
  selectedBarber,
  handleGetFeedback,
  feedbackText,
  ratings,
}) => {
  const [editedFeedbackText, setEditedFeedbackText] = useState({});
  const [editFeedbackId, setEditFeedbackId] = useState(null);
  const [feedbackLimit, setFeedbackLimit] = useState(5);
  const [initialHeight, setInitialHeight] = useState("25px");
  const [height, setHeight] = useState("25px");

  const { id: clientId } = useAuth();
  const user = useSelector((state) => state.user);

  const handleEdit = (feedBack) => {
    setEditFeedbackId(feedBack.id);
    setEditedFeedbackText(feedBack);
    setHeight(initialHeight);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.salon-era.ru/feedbacks?id=${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Ошибка при удалении отзыва");
      setFeedbacks((prev) => prev.filter((feedback) => feedback.id !== id));
    } catch (error) {
      alert(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id) => {
    setLoading(true);
    const feedbackToUpdate = { ...editedFeedbackText, id };
    const formData = new FormData();
    formData.append(
      "clientData",
      JSON.stringify({
        ...feedbackToUpdate,
        createdAt: formattedDateTimeForServer(),
      })
    );
    try {
      const response = await fetch(
        `https://api.salon-era.ru/feedbacks/update`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Ошибка при сохранении услуги");

      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? editedFeedbackText : f))
      );
      setEditFeedbackId(null);
      setEditedFeedbackText({});
      setInitialHeight(height);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const newText = e.target.value;
    setEditedFeedbackText({ ...editedFeedbackText, text: newText });

    const textarea = e.target;
    const textHeight = textarea.scrollHeight;
    const finalHeight = Math.min(textHeight, 250);
    setHeight(`${finalHeight}px`);
  };

  const handleFeedbackChange = (e) => {
    const newText = e.target.value;
    setFeedbackText(newText);
    setEditedFeedbackText(newText);

    const textarea = e.target;
    const textHeight = textarea.scrollHeight;
    const finalHeight = Math.min(textHeight, 250);
    setHeight(`${finalHeight}px`);
  };

  const handleRate = (barberId, newRating) => {
    setRatings((prev) => ({ ...prev, [barberId]: newRating }));
  };

  const loadMoreFeedbacks = () => {
    setFeedbackLimit((prev) => prev + 5);
  };

  const formattedDateTimeForServer = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}T${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
      now.getSeconds()
    ).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}`;
  };

  const formatDate = (utcDateString) => {
    
    const utcStringWithZ = utcDateString.endsWith("Z")
      ? utcDateString
      : utcDateString + "Z";

    const d = new Date(utcStringWithZ);

    return `${d.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}, ${d.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  };
  
  
  

  const getBarberFeedbacks = (barberId) =>
    feedbacks.filter((f) => f.id_employee_to === barberId);

  const handleSubmitFeedback = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append(
      "clientData",
      JSON.stringify([
        {
          firstName: user.firstName,
          lastName: user.lastName,
          id_client_from: clientId,
          id_employee_to: selectedBarber.id,
          text: feedbackText,
          value: ratings[selectedBarber.id],
        },
      ])
    );

    try {
      const response = await fetch(`https://api.salon-era.ru/feedbacks`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Ошибка при отправке");

      setFeedbackText("");
      setRatings((prev) => ({ ...prev, [selectedBarber.id]: 0 }));
      handleGetFeedback();
    } catch {
      alert(`Зарегистрируйтесь , чтобы оставлять комментарии`);
    } finally {
      setLoading(false);
    }
  };

  const isFeedbackDisabled =
    !feedbackText.trim() || ratings[selectedBarber?.id] === 0;

  return {
    user,
    clientId,
    editedFeedbackText,
    editFeedbackId,
    feedbackLimit,
    height,
    handleEdit,
    handleDelete,
    handleSave,
    handleChange,
    handleFeedbackChange,
    handleRate,
    loadMoreFeedbacks,
    formatDate,
    getBarberFeedbacks,
    isFeedbackDisabled,
    handleSubmitFeedback,
    setEditFeedbackId,
  };
};
