using AutoMapper;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Domain.Entities;

namespace GiaPhaHub_be.Api.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        //FamilyMember
        CreateMap<FamilyMember, FamilyMemberResponse>();
        CreateMap<CreateFamilyMemberRequest, FamilyMember>();
        CreateMap<UpdateFamilyMemberRequest, FamilyMember>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        //FamilyTree
        CreateMap<FamilyTree, FamilyTreeResponse>();
        CreateMap<CreateFamilyTreeRequest, FamilyTree>();
        CreateMap<UpdateFamilyTreeRequest, FamilyTree>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

        //Relationship
        CreateMap<Relationship, RelationshipResponse>()
          .ForMember(dest => dest.FromMemberName, opt => opt.MapFrom(src => src.FromMember.Name))
          .ForMember(dest => dest.ToMemberName, opt => opt.MapFrom(src => src.ToMember.Name))
          .ForMember(dest => dest.RelationshipTypeName, opt => opt.MapFrom(src => src.RelationshipType.Name));
        CreateMap<CreateRelationshipRequest, Relationship>();
        CreateMap<UpdateRelationshipRequest, Relationship>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        //RelationshipType
        CreateMap<RelationshipType, RelationshipTypeResponse>();
        CreateMap<CreateRelationshipTypeRequest, RelationshipType>();
        CreateMap<UpdateRelationshipTypeRequest, RelationshipType>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        //User
        CreateMap<User, UserResponse>();
        CreateMap<UpdateUserRequest, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
    }
}
