using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Application.IServices;

namespace GiaPhaHub_be.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] QueryResource queryResource)
    {
        var result = await _userService.GetAll(queryResource);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _userService.GetById(id);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateUserRequest request)
    {
        var result = await _userService.Update(id, request);
        return StatusCode((int)result.StatusCode, result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _userService.Delete(id);
        return StatusCode((int)result.StatusCode, result);
    }
}
