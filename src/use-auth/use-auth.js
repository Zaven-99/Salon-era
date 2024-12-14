import { useSelector } from "react-redux";

export function useAuth() {
  const { firstName, lastName, login, token, email , phone , gender, clientType,imageLink, id} = useSelector((state) => state.user);
  return {
    isAuth: !!login,
    id,
    firstName,
    lastName,
    login,
    email,
    phone,
    gender,
    token,
    clientType,
    imageLink,
  };
}
