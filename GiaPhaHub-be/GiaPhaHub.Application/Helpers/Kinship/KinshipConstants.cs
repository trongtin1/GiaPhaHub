using System.Globalization;

namespace GiaPhaHub_be.Application.Helpers.Kinship;

public static class KinshipConstants
{
    public const string ParentStep = "parent";
    public const string ChildStep = "child";
    public const string SiblingStep = "sibling";
    public const string SpouseStep = "spouse";

    public static readonly HashSet<string> ParentTypeNames =
        new(StringComparer.OrdinalIgnoreCase)
        {
            "parent",
            "father",
            "mother",
            "cha",
            "mẹ",
            "bo",
            "bố",
            "má",
            "me"
        };

    public static readonly HashSet<string> SiblingTypeNames =
        new(StringComparer.OrdinalIgnoreCase)
        {
            "sibling",
            "anh",
            "chị",
            "chi",
            "em"
        };

    public static readonly HashSet<string> SpouseTypeNames =
        new(StringComparer.OrdinalIgnoreCase)
        {
            "spouse",
            "spouce",
            "vợ",
            "vo",
            "chồng",
            "chong",
            "phu",
            "thê",
            "the"
        };

    public static string ToVietnameseLowercase(string value)
        => value.ToLower(new CultureInfo("vi-VN"));
}
