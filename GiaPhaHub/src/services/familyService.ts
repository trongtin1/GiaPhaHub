import axios from "./axios";
import type { FamilyMemberResponse, FamilyMemberRequest } from "@/models/FamilyMember";
import type { GetListResponse, BaseResponse } from "@/models/ResponseModels";

export const FamilyService = {
  getAll: async (): Promise<GetListResponse<FamilyMemberResponse>> => {
    return await axios({
      method: "get",
      url: "/FamilyMember",
    });
  },

  getOne: async (id: number): Promise<BaseResponse<FamilyMemberResponse>> => {
    return await axios({
      method: "get",
      url: `/FamilyMember/${id}`,
    });
  },

  create: async (
    payload: Omit<FamilyMemberRequest, "id">,
  ): Promise<BaseResponse<FamilyMemberResponse>> => {
    return await axios({
      method: "post",
      url: "/FamilyMember",
      data: payload,
    });
  },

  update: async (
    id: number,
    payload: Omit<FamilyMemberRequest, "id">,
  ): Promise<BaseResponse<FamilyMemberResponse>> => {
    return await axios({
      method: "put",
      url: `/FamilyMember/${id}`,
      data: payload,
    });
  },

  delete: async (id: number): Promise<BaseResponse<FamilyMemberResponse>> => {
    return await axios({
      method: "delete",
      url: `/FamilyMember/${id}`,
    });
  },

  getTree: async (rootId: number): Promise<BaseResponse<FamilyMemberResponse>> => {
    return await axios({
      method: "get",
      url: `/FamilyMember/tree/${rootId}`,
    });
  },
};
