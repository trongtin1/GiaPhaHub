using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Application.IServices;

namespace GiaPhaHub_be.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FamilyMemberController : ControllerBase
{
    private readonly IFamilyMemberService _familyMemberService;

    public FamilyMemberController(IFamilyMemberService familyMemberService)
    {
        _familyMemberService = familyMemberService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(QueryResource queryResource)
    {
        var result = await _familyMemberService.GetAll(queryResource);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _familyMemberService.GetById(id);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFamilyMemberRequest request)
    {
        var result = await _familyMemberService.Create(request);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateFamilyMemberRequest request)
    {
        var result = await _familyMemberService.Update(id, request);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _familyMemberService.Delete(id);
        return StatusCode((int)result.StatusCode, result);
    }
}
