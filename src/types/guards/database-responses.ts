import { User } from "../interfaces/entities/users";

const containsIdProperty = (response: object) => "_id" in response;

// Custom guards to check if returned object/арраъ implements interface
export const isResponseInstanceOfUser = (
  response: object | object[],
): response is User => {
  if (Array.isArray(response)) {
    let isInstance = true;

    response.forEach((item: object) => {
      if (!isResponseInstanceOfUser(item)) {
        isInstance = false;
        return;
      }
    });

    return isInstance;
  } else if (typeof response === "object") {
    return (
      containsIdProperty(response) &&
      "username" in response &&
      "email" in response &&
      "password" in response &&
      "gender" in response &&
      "goals" in response
    );
  } else return false;
};

export const isServiceOutcome = (response: object) => {
  return "success" in response && "message" in response;
};
