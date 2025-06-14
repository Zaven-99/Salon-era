import { useSelector } from "react-redux";

export function useAuth() {
  const {
    first_name,
    last_name,
    login,
    token,
    email,
    phone,
    gender,
    role,
    image_link,
    id,
  } = useSelector((state) => state.user);
  return {
    isAuth: !!login,
    id,
    first_name,
    last_name,
    login,
    email,
    phone,
    gender,
    role,
    token,
    image_link,
  };
}
