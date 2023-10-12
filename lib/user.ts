import { fetchApi } from "./utils";

export const getUserById = async (id: string) => {
  return fetchApi("/api/user/byId", { id });
};

export const createUser = async (id: string) => {
  return fetchApi("/api/user/create", { id });
};

export const upsertUser = async (
  id: string,
  timestampEnter?: Date,
  timestampExit?: Date
) => {
  return fetchApi("/api/user/upsert", { id, timestampEnter, timestampExit });
};
