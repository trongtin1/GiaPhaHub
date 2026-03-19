import axios from "./axios";
import type { BaseResponse, GetListResponse } from "@/models/ResponseModels";
import type {
  KinshipInferenceRequest,
  KinshipInferenceResponse,
  RelationshipRequest,
  RelationshipResponse,
} from "@/models/Relationship";

export const RelationshipService = {
  getAll: async (
    query?: RelationshipRequest,
  ): Promise<GetListResponse<RelationshipResponse>> => {
    return await axios({
      method: "get",
      url: "/Relationship",
      params: query,
    });
  },

  getOne: async (id: number): Promise<BaseResponse<RelationshipResponse>> => {
    return await axios({
      method: "get",
      url: `/Relationship/${id}`,
    });
  },

  getByMemberId: async (
    memberId: number,
  ): Promise<BaseResponse<RelationshipResponse[]>> => {
    return await axios({
      method: "get",
      url: `/Relationship/member/${memberId}`,
    });
  },

  create: async (
    payload: RelationshipRequest,
  ): Promise<BaseResponse<RelationshipResponse>> => {
    return await axios({
      method: "post",
      url: "/Relationship",
      data: payload,
    });
  },

  update: async (
    id: number,
    payload: RelationshipRequest,
  ): Promise<BaseResponse<RelationshipResponse>> => {
    return await axios({
      method: "put",
      url: `/Relationship/${id}`,
      data: payload,
    });
  },

  delete: async (id: number): Promise<BaseResponse<boolean>> => {
    return await axios({
      method: "delete",
      url: `/Relationship/${id}`,
    });
  },

  inferKinship: async (
    payload: KinshipInferenceRequest,
  ): Promise<BaseResponse<KinshipInferenceResponse>> => {
    return await axios({
      method: "post",
      url: "/Relationship/infer-kinship",
      data: payload,
    });
  },
};
