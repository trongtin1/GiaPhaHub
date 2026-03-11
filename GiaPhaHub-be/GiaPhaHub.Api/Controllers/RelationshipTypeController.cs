using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Application.IServices;

namespace GiaPhaHub_be.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RelationshipTypeController : ControllerBase
{
    private readonly IRelationshipTypeService _relationshipTypeService;

    public RelationshipTypeController(IRelationshipTypeService relationshipTypeService)
    {
        _relationshipTypeService = relationshipTypeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] QueryResource queryResource)
    {
        var result = await _relationshipTypeService.GetAll(queryResource);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _relationshipTypeService.GetById(id);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRelationshipTypeRequest request)
    {
        var result = await _relationshipTypeService.Create(request);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRelationshipTypeRequest request)
    {
        var result = await _relationshipTypeService.Update(id, request);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _relationshipTypeService.Delete(id);
        return StatusCode((int)result.StatusCode, result);
    }
}
