import { Conversation } from "src/modules/conversations/schemas/conversation.schema";
import { Message } from "../interfaces/entities/messages";
import { SelfCarePlan } from "../interfaces/entities/plans";
import { User } from "../interfaces/entities/users";
import { ActivityProperties } from "src/modules/activity-properties/schemas/activity-properties.schema";

const containsIdProperty = (response: object) => "_id" in response;

// Custom guards to check if returned object implements interface
// TO DO: Make one generic function to avoid repetitive code
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

export const isResponseInstanceOfMessage = (
  response: object | object[],
): response is Message => {
  if (Array.isArray(response)) {
    let isInstance = true;

    response.forEach((item: object) => {
      if (!isResponseInstanceOfMessage(item)) {
        isInstance = false;
        return;
      }
    });

    return isInstance;
  } else if (typeof response === "object") {
    return (
      containsIdProperty(response) &&
      "timestamp" in response &&
      "message" in response &&
      "type" in response
    );
  } else return false;
};

export const isResponseInstanceOfSelfCarePlan = (
  response: object | object[],
): response is SelfCarePlan => {
  if (Array.isArray(response)) {
    let isInstance = true;

    response.forEach((item: object) => {
      if (!isResponseInstanceOfMessage(item)) {
        isInstance = false;
        return;
      }
    });

    return isInstance;
  } else if (typeof response === "object") {
    return (
      containsIdProperty(response) &&
      "description" in response &&
      "isCompleted" in response &&
      "progress" in response &&
      "targetDate" in response &&
      "dailyTasks" in response
    );
  } else return false;
};

export const isResponseInstanceOfConversation = (
  response: object | object[],
): response is Conversation => {
  if (Array.isArray(response)) {
    let isInstance = true;

    response.forEach((item: object) => {
      if (!isResponseInstanceOfMessage(item)) {
        isInstance = false;
        return;
      }
    });

    return isInstance;
  } else if (typeof response === "object") {
    return (
      containsIdProperty(response) &&
      "dateCreated" in response &&
      "messages" in response &&
      "title" in response &&
      "isArchived" in response
    );
  } else return false;
};

export const isResponseInstanceOfActivityProperties = (
  response: object | object[],
): response is ActivityProperties => {
  if (Array.isArray(response)) {
    let isInstance = true;

    response.forEach((item: object) => {
      if (!isResponseInstanceOfMessage(item)) {
        isInstance = false;
        return;
      }
    });

    return isInstance;
  } else if (typeof response === "object") {
    return (
      containsIdProperty(response) &&
      "activityName" in response &&
      "benefits" in response &&
      "metric" in response &&
      "metricQuantity" in response
    );
  } else return false;
};

export const isServiceOutcome = (response: object) => {
  return "success" in response && "message" in response;
};
