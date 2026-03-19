using AutoMapper;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Domain.Entities;

namespace GiaPhaHub_be.Api.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        //FamilyMember
        CreateMap<FamilyMember, FamilyMemberResponse>()
            .ForMember(dest => dest.FatherId, opt => opt.Ignore())
            .ForMember(dest => dest.MotherId, opt => opt.Ignore())
            .ForMember(dest => dest.Spouses, opt => opt.Ignore())
            .ForMember(dest => dest.Children, opt => opt.Ignore())
            .ForMember(dest => dest.Members, opt => opt.Ignore());
        CreateMap<FamilyMemberRequest, FamilyMember>()
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
          .ForMember(dest => dest.RelationshipType, opt => opt.MapFrom(src => src.RelationshipType));
        CreateMap<RelationshipRequest, Relationship>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        //RelationshipType
        CreateMap<RelationshipType, RelationshipTypeResponse>();
        CreateMap<RelationshipTypeRequest, RelationshipType>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        //User
        CreateMap<User, UserResponse>();
        CreateMap<UpdateUserRequest, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
    }
}
