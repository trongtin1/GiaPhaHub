using GiaPhaHub_be.Domain.Entities;

namespace GiaPhaHub_be.Application.Helpers.Kinship;

public static class KinshipInferenceHelper
{
    public static KinshipInferenceInternalResult Infer(
        Dictionary<int, FamilyMember> memberMap,
        List<Relationship> relationships,
        int sourceId,
        int targetId)
    {
        var source = memberMap.GetValueOrDefault(sourceId);
        var target = memberMap.GetValueOrDefault(targetId);

        if (source is null || target is null)
        {
            throw new ArgumentException("Source hoặc target không hợp lệ trong memberMap.");
        }

        var graph = BuildRelationshipGraph(relationships);
        var bfsResult = FindShortestRelationshipPath(graph, sourceId, targetId);

        if (bfsResult is null)
        {
            return new KinshipInferenceInternalResult
            {
                SourceId = sourceId,
                TargetId = targetId,
                SourceBase = "unrelated",
                TargetBase = "unrelated",
                SourceLabel = "không có quan hệ",
                TargetLabel = "không có quan hệ",
                IsBloodRelated = false,
                HumanReadable = $"{source.Name} không có quan hệ trực tiếp với {target.Name}",
                ReverseHumanReadable = $"{target.Name} không có quan hệ trực tiếp với {source.Name}"
            };
        }

        var targetRoleFromSourcePerspective = AnalyzeRelationshipPath(bfsResult.RelationshipPath);
        var targetRelativeToSource = InferVietnameseLabel(
            bfsResult.RelationshipPath,
            bfsResult.MemberPath,
            memberMap);
        var targetBase = InferBaseFromPath(bfsResult.RelationshipPath, targetRoleFromSourcePerspective);

        var sourcePath = ReversePath(bfsResult.RelationshipPath);
        var sourceMemberPath = bfsResult.MemberPath.AsEnumerable().Reverse().ToList();
        var sourceRoleFromTargetPerspective = AnalyzeRelationshipPath(sourcePath);
        var sourceRelativeToTarget = InferVietnameseLabel(sourcePath, sourceMemberPath, memberMap);
        var sourceBase = InferBaseFromPath(sourcePath, sourceRoleFromTargetPerspective);

        return new KinshipInferenceInternalResult
        {
            SourceId = sourceId,
            TargetId = targetId,
            SourceBase = sourceBase,
            TargetBase = targetBase,
            SourceLabel = sourceRelativeToTarget.Label,
            TargetLabel = targetRelativeToSource.Label,
            IsBloodRelated = sourceRelativeToTarget.IsBloodRelated,
            HumanReadable = $"{source.Name} là {KinshipConstants.ToVietnameseLowercase(sourceRelativeToTarget.Label)} của {target.Name}",
            ReverseHumanReadable = $"{target.Name} là {KinshipConstants.ToVietnameseLowercase(targetRelativeToSource.Label)} của {source.Name}"
        };
    }

    private static string NormalizeTypeName(string? relationshipTypeName)
        => (relationshipTypeName ?? string.Empty).Trim().ToLowerInvariant();

    private static bool IsMale(string? gender)
    {
        var normalized = (gender ?? string.Empty).Trim().ToLowerInvariant();
        return normalized is "male" or "m" or "man" or "nam";
    }

    private static bool IsFemale(string? gender)
    {
        var normalized = (gender ?? string.Empty).Trim().ToLowerInvariant();
        return normalized is "female" or "f" or "woman" or "nu" or "nữ";
    }

    private static bool IsAllSteps(List<string> relationshipPath, string step)
        => relationshipPath.Count > 0 && relationshipPath.All(item => string.Equals(item, step, StringComparison.Ordinal));

    private static FamilyMember? GetByPathIndex(List<int> memberPath, Dictionary<int, FamilyMember> memberMap, int index)
    {
        if (index < 0 || index >= memberPath.Count)
        {
            return null;
        }

        return memberMap.GetValueOrDefault(memberPath[index]);
    }

    private static string GetParentLabel(string? gender)
    {
        if (IsMale(gender)) return "cha";
        if (IsFemale(gender)) return "mẹ";
        return "cha/mẹ";
    }

    private static string GetChildLabel(string? gender)
    {
        if (IsMale(gender)) return "con trai";
        if (IsFemale(gender)) return "con gái";
        return "con";
    }

    private static string GetSiblingLabel(string? gender)
    {
        if (IsMale(gender)) return "anh/em trai";
        if (IsFemale(gender)) return "chị/em gái";
        return "anh/chị/em";
    }

    private static string GetSpouseLabel(string? gender)
    {
        if (IsMale(gender)) return "chồng";
        if (IsFemale(gender)) return "vợ";
        return "vợ/chồng";
    }

    private static string GetGrandparentLabel(string? targetGender, string? sourceParentGender)
    {
        if (IsMale(targetGender))
        {
            if (IsMale(sourceParentGender)) return "ông nội";
            if (IsFemale(sourceParentGender)) return "ông ngoại";
            return "ông";
        }

        if (IsFemale(targetGender))
        {
            if (IsMale(sourceParentGender)) return "bà nội";
            if (IsFemale(sourceParentGender)) return "bà ngoại";
            return "bà";
        }

        if (IsMale(sourceParentGender)) return "ông/bà nội";
        if (IsFemale(sourceParentGender)) return "ông/bà ngoại";
        return "ông/bà";
    }

    private static string GetGrandchildLabel(string? sourceChildGender, string? targetGender)
    {
        var side = IsMale(sourceChildGender)
            ? "nội"
            : IsFemale(sourceChildGender)
                ? "ngoại"
                : string.Empty;

        if (IsMale(targetGender))
        {
            return string.IsNullOrWhiteSpace(side) ? "cháu trai" : $"cháu trai {side}";
        }

        if (IsFemale(targetGender))
        {
            return string.IsNullOrWhiteSpace(side) ? "cháu gái" : $"cháu gái {side}";
        }

        return string.IsNullOrWhiteSpace(side) ? "cháu" : $"cháu {side}";
    }

    private static long? GetTimeValue(DateTime? dateValue)
    {
        if (!dateValue.HasValue)
        {
            return null;
        }

        return dateValue.Value.ToUniversalTime().Ticks;
    }

    private static bool? IsOlderThan(DateTime? memberBirthDate, DateTime? referenceBirthDate)
    {
        var memberTime = GetTimeValue(memberBirthDate);
        var referenceTime = GetTimeValue(referenceBirthDate);

        if (memberTime is null || referenceTime is null)
        {
            return null;
        }

        return memberTime.Value < referenceTime.Value;
    }

    private static string GetUncleAuntLabel(FamilyMember? target, FamilyMember? sourceParent)
    {
        var targetGender = target?.Gender;
        var sourceParentGender = sourceParent?.Gender;

        if (IsMale(sourceParentGender))
        {
            if (IsMale(targetGender))
            {
                var older = IsOlderThan(target?.BirthDate, sourceParent?.BirthDate);
                if (older == true) return "bác";
                if (older == false) return "chú";
                return "chú/bác";
            }

            if (IsFemale(targetGender)) return "cô";
            return "cô/chú/bác";
        }

        if (IsFemale(sourceParentGender))
        {
            if (IsMale(targetGender)) return "cậu";
            if (IsFemale(targetGender)) return "dì";
            return "cậu/dì";
        }

        if (IsMale(targetGender)) return "chú/bác/cậu";
        if (IsFemale(targetGender)) return "cô/dì";
        return "cô/chú/bác/dì/cậu";
    }

    private static string GetInLawParentLabel(string? targetGender, string? spouseGender)
    {
        if (IsMale(targetGender))
        {
            if (IsMale(spouseGender)) return "bố chồng";
            if (IsFemale(spouseGender)) return "bố vợ";
            return "bố vợ/chồng";
        }

        if (IsFemale(targetGender))
        {
            if (IsMale(spouseGender)) return "mẹ chồng";
            if (IsFemale(spouseGender)) return "mẹ vợ";
            return "mẹ vợ/chồng";
        }

        if (IsMale(spouseGender)) return "bố/mẹ chồng";
        if (IsFemale(spouseGender)) return "bố/mẹ vợ";
        return "bố/mẹ vợ/chồng";
    }

    private static string GetSpouseSiblingLabel(string? spouseGender, string? targetGender)
    {
        var spouseSide = IsMale(spouseGender)
            ? "chồng"
            : IsFemale(spouseGender)
                ? "vợ"
                : "vợ/chồng";

        if (IsMale(targetGender)) return $"anh/em {spouseSide}";
        if (IsFemale(targetGender)) return $"chị/em {spouseSide}";
        return $"anh/chị/em {spouseSide}";
    }

    private static string GetSiblingSpouseLabel(string? targetGender)
    {
        if (IsMale(targetGender)) return "anh/chị/em rể";
        if (IsFemale(targetGender)) return "chị/em dâu";
        return "dâu/rể";
    }

    private static string GetStepParentLabel(string? targetGender)
    {
        if (IsMale(targetGender)) return "cha dượng";
        if (IsFemale(targetGender)) return "mẹ kế";
        return "cha/mẹ kế";
    }

    private static string InferBaseFromPath(List<string> relationshipPath, RelationshipPathAnalysis analysis)
    {
        if (relationshipPath.Count == 0) return "self";

        var pattern = string.Join(">", relationshipPath);
        if (pattern == "spouse") return "spouse";
        if (pattern == "parent") return "parent";
        if (pattern == "child") return "child";
        if (pattern == "parent>parent") return "grandparent";
        if (pattern == "child>child") return "grandchild";
        if (pattern == "sibling") return "sibling";
        if (pattern == "parent>child") return "sibling";

        if (pattern is "parent>sibling" or "parent>parent>child")
        {
            return "uncle_aunt";
        }

        if (analysis.HasSpouse)
        {
            return "relative";
        }

        if (IsAllSteps(relationshipPath, KinshipConstants.ParentStep))
        {
            return "grandparent";
        }

        if (IsAllSteps(relationshipPath, KinshipConstants.ChildStep))
        {
            return "grandchild";
        }

        return "relative";
    }

    private static (string Label, bool IsBloodRelated) InferVietnameseLabel(
        List<string> relationshipPath,
        List<int> memberPath,
        Dictionary<int, FamilyMember> memberMap)
    {
        var target = GetByPathIndex(memberPath, memberMap, memberPath.Count - 1);
        var firstHop = GetByPathIndex(memberPath, memberMap, 1);
        var pattern = string.Join(">", relationshipPath);

        if (relationshipPath.Count == 0)
        {
            return ("chính mình", true);
        }

        if (pattern == "spouse")
        {
            return (GetSpouseLabel(target?.Gender), false);
        }

        if (pattern == "parent")
        {
            return (GetParentLabel(target?.Gender), true);
        }

        if (pattern == "child")
        {
            return (GetChildLabel(target?.Gender), true);
        }

        if (pattern == "sibling")
        {
            return (GetSiblingLabel(target?.Gender), true);
        }

        if (pattern == "parent>child")
        {
            return (GetSiblingLabel(target?.Gender), true);
        }

        if (pattern == "parent>parent")
        {
            return (GetGrandparentLabel(target?.Gender, firstHop?.Gender), true);
        }

        if (pattern == "child>child")
        {
            return (GetGrandchildLabel(firstHop?.Gender, target?.Gender), true);
        }

        if (pattern is "parent>sibling" or "parent>parent>child")
        {
            return (GetUncleAuntLabel(target, firstHop), true);
        }

        if (pattern == "sibling>child")
        {
            return (GetGrandchildLabel(null, target?.Gender), true);
        }

        if (pattern == "parent>child>child")
        {
            return (GetGrandchildLabel(null, target?.Gender), true);
        }

        if (pattern is "parent>sibling>child" or "parent>parent>child>child")
        {
            return ("anh/chị/em họ", true);
        }

        if (pattern == "spouse>parent")
        {
            return (GetInLawParentLabel(target?.Gender, firstHop?.Gender), false);
        }

        if (pattern == "child>spouse")
        {
            if (IsMale(target?.Gender)) return ("con rể", false);
            if (IsFemale(target?.Gender)) return ("con dâu", false);
            return ("con dâu/rể", false);
        }

        if (pattern == "spouse>sibling")
        {
            return (GetSpouseSiblingLabel(firstHop?.Gender, target?.Gender), false);
        }

        if (pattern == "spouse>parent>child")
        {
            return (GetSpouseSiblingLabel(firstHop?.Gender, target?.Gender), false);
        }

        if (pattern == "sibling>spouse")
        {
            return (GetSiblingSpouseLabel(target?.Gender), false);
        }

        if (pattern == "parent>child>spouse")
        {
            return (GetSiblingSpouseLabel(target?.Gender), false);
        }

        if (pattern == "parent>spouse")
        {
            return (GetStepParentLabel(target?.Gender), false);
        }

        if (pattern == "child>spouse>parent")
        {
            return ("thông gia", false);
        }

        if (pattern == "spouse>child")
        {
            return ("con riêng của vợ/chồng", false);
        }

        if (IsAllSteps(relationshipPath, KinshipConstants.ParentStep))
        {
            if (relationshipPath.Count == 3)
            {
                if (IsMale(target?.Gender)) return ("cụ ông", true);
                if (IsFemale(target?.Gender)) return ("cụ bà", true);
                return ("cụ", true);
            }

            return ($"tổ tiên cách {relationshipPath.Count - 1} đời", true);
        }

        if (IsAllSteps(relationshipPath, KinshipConstants.ChildStep))
        {
            if (relationshipPath.Count == 3)
            {
                return ("chắt", true);
            }

            if (relationshipPath.Count == 4)
            {
                return ("chút", true);
            }

            return ($"hậu duệ cách {relationshipPath.Count - 1} đời", true);
        }

        if (relationshipPath.Contains(KinshipConstants.SpouseStep))
        {
            return ("thông gia", false);
        }

        return ("họ hàng", true);
    }

    private static void AddEdge(Dictionary<int, List<RelationshipEdge>> graph, int from, int to, string type)
    {
        if (!graph.TryGetValue(from, out var existing))
        {
            existing = new List<RelationshipEdge>();
            graph[from] = existing;
        }

        if (existing.Any(edge => edge.To == to && string.Equals(edge.Type, type, StringComparison.Ordinal)))
        {
            return;
        }

        existing.Add(new RelationshipEdge(to, type));
    }

    private static Dictionary<int, List<RelationshipEdge>> BuildRelationshipGraph(List<Relationship> relationships)
    {
        var graph = new Dictionary<int, List<RelationshipEdge>>();

        foreach (var relationship in relationships)
        {
            var type = NormalizeTypeName(relationship.RelationshipType?.Name);
            var from = relationship.FromMemberId;
            var to = relationship.ToMemberId;

            if (from <= 0 || to <= 0)
            {
                continue;
            }

            if (KinshipConstants.ParentTypeNames.Contains(type))
            {
                AddEdge(graph, from, to, KinshipConstants.ParentStep);
                AddEdge(graph, to, from, KinshipConstants.ChildStep);
                continue;
            }

            if (KinshipConstants.SiblingTypeNames.Contains(type))
            {
                AddEdge(graph, from, to, KinshipConstants.SiblingStep);
                AddEdge(graph, to, from, KinshipConstants.SiblingStep);
                continue;
            }

            if (KinshipConstants.SpouseTypeNames.Contains(type))
            {
                AddEdge(graph, from, to, KinshipConstants.SpouseStep);
                AddEdge(graph, to, from, KinshipConstants.SpouseStep);
            }
        }

        return graph;
    }

    private static BfsResult? FindShortestRelationshipPath(
        Dictionary<int, List<RelationshipEdge>> graph,
        int sourceId,
        int targetId)
    {
        if (sourceId == targetId)
        {
            return new BfsResult(new List<int> { sourceId }, new List<string>());
        }

        var queue = new Queue<int>();
        queue.Enqueue(sourceId);

        var visited = new HashSet<int> { sourceId };
        var previous = new Dictionary<int, (int From, string Relation)>();

        while (queue.Count > 0)
        {
            var current = queue.Dequeue();
            if (!graph.TryGetValue(current, out var neighbors))
            {
                continue;
            }

            foreach (var edge in neighbors)
            {
                if (visited.Contains(edge.To))
                {
                    continue;
                }

                visited.Add(edge.To);
                previous[edge.To] = (current, edge.Type);

                if (edge.To == targetId)
                {
                    var relationshipPath = new List<string>();
                    var memberPath = new List<int> { targetId };

                    var walker = targetId;
                    while (walker != sourceId)
                    {
                        if (!previous.TryGetValue(walker, out var prev))
                        {
                            return null;
                        }

                        relationshipPath.Add(prev.Relation);
                        memberPath.Add(prev.From);
                        walker = prev.From;
                    }

                    relationshipPath.Reverse();
                    memberPath.Reverse();

                    return new BfsResult(memberPath, relationshipPath);
                }

                queue.Enqueue(edge.To);
            }
        }

        return null;
    }

    private static RelationshipPathAnalysis AnalyzeRelationshipPath(List<string> relationshipPath)
    {
        return new RelationshipPathAnalysis
        {
            UpCount = relationshipPath.Count(step => step == KinshipConstants.ParentStep),
            DownCount = relationshipPath.Count(step => step == KinshipConstants.ChildStep),
            HasSibling = relationshipPath.Contains(KinshipConstants.SiblingStep),
            HasSpouse = relationshipPath.Contains(KinshipConstants.SpouseStep)
        };
    }

    private static List<string> ReversePath(List<string> relationshipPath)
    {
        return relationshipPath
            .AsEnumerable()
            .Reverse()
            .Select(step =>
            {
                if (step == KinshipConstants.ParentStep) return KinshipConstants.ChildStep;
                if (step == KinshipConstants.ChildStep) return KinshipConstants.ParentStep;
                return step;
            })
            .ToList();
    }

    private sealed record RelationshipEdge(int To, string Type);

    private sealed record BfsResult(List<int> MemberPath, List<string> RelationshipPath);

    private sealed class RelationshipPathAnalysis
    {
        public int UpCount { get; init; }
        public int DownCount { get; init; }
        public bool HasSibling { get; init; }
        public bool HasSpouse { get; init; }
    }
}

public sealed class KinshipInferenceInternalResult
{
    public int SourceId { get; init; }
    public int TargetId { get; init; }
    public string SourceBase { get; init; } = string.Empty;
    public string TargetBase { get; init; } = string.Empty;
    public string SourceLabel { get; init; } = string.Empty;
    public string TargetLabel { get; init; } = string.Empty;
    public bool IsBloodRelated { get; init; }
    public string HumanReadable { get; init; } = string.Empty;
    public string ReverseHumanReadable { get; init; } = string.Empty;
}
