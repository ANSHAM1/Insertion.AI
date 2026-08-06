from enum import Enum


class JobStatus(str, Enum):
    FOUND      = "FOUND"
    APPLIED    = "APPLIED"
    OA         = "OA"
    INTERVIEW  = "INTERVIEW"
    HR         = "HR"
    OFFER      = "OFFER"
    REJECTED   = "REJECTED"
    ACCEPTED   = "ACCEPTED"
    WITHDRAWN  = "WITHDRAWN"
    


class CodingStatus(Enum):
    FAILED         = "FAILED"
    SOLVED         = "SOLVED"
    OPTIMAL        = "OPTIMAL"



class CodingDifficulty(Enum):
    EASY   = "EASY"
    MEDIUM = "MEDIUM"
    HARD   = "HARD"



class ProgrammingLanguage(Enum):
    CPP        = "CPP"
    C          = "C"
    JAVA       = "JAVA"
    PYTHON     = "PYTHON"
    JAVASCRIPT = "JAVASCRIPT"
    TYPESCRIPT = "TYPESCRIPT"
    CSHARP     = "CSHARP"
    GO         = "GO"
    RUST       = "RUST"
    RUBY       = "RUBY"