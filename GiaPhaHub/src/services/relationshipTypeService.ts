import axios from "./axios";
import type { BaseResponse, GetListResponse } from "@/models/ResponseModels";
import type {
  RelationshipTypeRequest,
  RelationshipTypeResponse,
} from "@/models/Relationship";

export const RelationshipTypeService = {
  getAll: async (
    query?: RelationshipTypeRequest,
  ): Promise<GetListResponse<RelationshipTypeResponse>> => {
    return await axios({
      method: "get",
      url: "/RelationshipType",
      params: query,
    });
  },

  getOne: async (
    id: number,
  ): Promise<BaseResponse<RelationshipTypeResponse>> => {
    return await axios({
      method: "get",
      url: `/RelationshipType/${id}`,
    });
  },

  create: async (
    payload: RelationshipTypeRequest,
  ): Promise<BaseResponse<RelationshipTypeResponse>> => {
    return await axios({
      method: "post",
      url: "/RelationshipType",
      data: payload,
    });
  },

  update: async (
    id: number,
    payload: RelationshipTypeRequest,
  ): Promise<BaseResponse<RelationshipTypeResponse>> => {
    return await axios({
      method: "put",
      url: `/RelationshipType/${id}`,
      data: payload,
    });
  },

  delete: async (id: number): Promise<BaseResponse<boolean>> => {
    return await axios({
      method: "delete",
      url: `/RelationshipType/${id}`,
    });
  },
};
