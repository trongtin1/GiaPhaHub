using System.Linq.Expressions;
using AutoMapper;
using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Application.Extensions;
using GiaPhaHub_be.Application.IServices;
using GiaPhaHub_be.Domain.Common;
using GiaPhaHub_be.Domain.Entities;
using GiaPhaHub_be.Domain.Models;

namespace GiaPhaHub_be.Application.Services;

public class UserService : BaseService, IUserService
{
    public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        : base(unitOfWork, mapper)
    {
    }

    public async Task<Result<PageList<UserResponse>>> GetAll(QueryResource queryResource)
    {
        var pagingSpec = new PagingSpecification(queryResource);
        var columnsMap = new Dictionary<string, Expression<Func<User, object>>>
        {
            ["fullname"] = x => x.FullName,
            ["email"] = x => x.Email,
            ["createdate"] = x => x.CreateDate
        };

        var items = await _unitOfWork.IUserRepository.FindAll(
            predicate: u => u.IsDelete == false,
            orderBy: q => string.IsNullOrEmpty(queryResource.SortColumnBy)
                ? q.OrderBy(e => e.Id)
                : queryResource.IsSortColumnAscending
                    ? q.OrderBy(columnsMap[queryResource.SortColumnBy])
                    : q.OrderByDescending(columnsMap[queryResource.SortColumnBy]),
            pagingSpecification: pagingSpec
        );

        var result = items.MapToPageList<User, UserResponse>(_mapper);
        return Success(result);
    }

    public async Task<Result<UserResponse>> GetById(string id)
    {
        var repo = _unitOfWork.IUserRepository;
        var user = await repo.FindSingle(u => u.Id.ToString() == id && u.IsDelete == false);

        if (user is null)
            return NotFound<UserResponse>($"Không tìm thấy người dùng có Id = {id}.");
        var response = _mapper.Map<UserResponse>(user);
        return Success(response);
    }

    public async Task<Result<UserResponse>> Update(string id, UpdateUserRequest request)
    {
        var repo = _unitOfWork.IUserRepository;
        var user = await repo.FindSingle(u => u.Id.ToString() == id && u.IsDelete == false);

        if (user is null)
            return NotFound<UserResponse>($"Không tìm thấy người dùng có Id = {id}.");

        _mapper.Map(request, user);
        repo.Update(user);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<UserResponse>(user);
        return Success(response);
    }

    public async Task<Result<bool>> Delete(string id, bool isSoftDelete = true)
    {
        var repo = _unitOfWork.IUserRepository;
        var user = await repo.FindSingle(u => u.Id.ToString() == id && u.IsDelete == false);

        if (user is null)
            return NotFound<bool>($"Không tìm thấy người dùng có Id = {id}.");

        if (isSoftDelete)
        {
            user.IsDelete = true;
            repo.Update(user);
        }
        else
        {
            repo.Remove(user);
        }
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<UserResponse>(user);
        return Success(true, "Xoá người dùng thành công.");
    }
}
