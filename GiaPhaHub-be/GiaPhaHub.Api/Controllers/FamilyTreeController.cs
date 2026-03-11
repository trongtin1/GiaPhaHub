using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Application.IServices;

namespace GiaPhaHub_be.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FamilyTreeController : ControllerBase
{
    private readonly IFamilyTreeService _familyTreeService;

    public FamilyTreeController(IFamilyTreeService familyTreeService)
    {
        _familyTreeService = familyTreeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] QueryResource queryResource)
    {
        var result = await _familyTreeService.GetAll(queryResource);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _familyTreeService.GetById(id);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFamilyTreeRequest request)
    {
        var result = await _familyTreeService.Create(request);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateFamilyTreeRequest request)
    {
        var result = await _familyTreeService.Update(id, request);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _familyTreeService.Delete(id);
        return StatusCode((int)result.StatusCode, result);
    }
}
