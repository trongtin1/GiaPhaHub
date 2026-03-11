using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Application.IServices;

namespace GiaPhaHub_be.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RelationshipController : ControllerBase
{
    private readonly IRelationshipService _relationshipService;

    public RelationshipController(IRelationshipService relationshipService)
    {
        _relationshipService = relationshipService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] QueryResource queryResource)
    {
        var result = await _relationshipService.GetAll(queryResource);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _relationshipService.GetById(id);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpGet("member/{memberId}")]
    public async Task<IActionResult> GetByMemberId(int memberId)
    {
        var result = await _relationshipService.GetByMemberId(memberId);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRelationshipRequest request)
    {
        var result = await _relationshipService.Create(request);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRelationshipRequest request)
    {
        var result = await _relationshipService.Update(id, request);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _relationshipService.Delete(id);
        return StatusCode((int)result.StatusCode, result);
    }
}
