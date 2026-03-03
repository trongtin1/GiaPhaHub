import axios from "./axios";
import type { FamilyMember } from "@/types";
import type {
  GetListResponse,
  BaseResponse,
} from "../models/ResponseModels";

export const FamilyService = {
  getAll: async (): Promise<GetListResponse<FamilyMember>> => {
    return await axios({
      method: "get",
      url: "/FamilyMember",
    });
  },

  getOne: async (id: string): Promise<BaseResponse<FamilyMember>> => {
    return await axios({
      method: "get",
      url: `/FamilyMember/${id}`,
    });
  },

  create: async (
    payload: Omit<FamilyMember, "id">
  ): Promise<BaseResponse<FamilyMember>> => {
    return await axios({
      method: "post",
      url: "/FamilyMember",
      data: payload,
    });
  },

  update: async (
    id: string,
    payload: FamilyMember
  ): Promise<BaseResponse<FamilyMember>> => {
    return await axios({
      method: "put",
      url: `/FamilyMember/${id}`,
      data: payload,
    });
  },

  delete: async (id: string): Promise<BaseResponse<FamilyMember>> => {
    return await axios({
      method: "delete",
      url: `/FamilyMember/${id}`,
    });
  },
};
