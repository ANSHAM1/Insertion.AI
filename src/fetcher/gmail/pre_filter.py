import re

from src.fetcher.gmail.models import ParsedEmail


# ==========================================================
# Strong Career Keywords
# ==========================================================

CAREER_PATTERNS = [

    # Jobs
    r"\bjob\b",
    r"\bjobs\b",
    r"\bhiring\b",
    r"\brecruiter\b",
    r"\brecruitment\b",
    r"\bcareer\b",
    r"\bcareers\b",
    r"\binternship\b",
    r"\bintern\b",
    r"\bplacement\b",
    r"\bcampus drive\b",
    r"\bwalk[- ]?in\b",

    # Assessments
    r"\boa\b",
    r"\bonline assessment\b",
    r"\bcoding assessment\b",
    r"\bassessment\b",
    r"\bhackerrank\b",
    r"\bcodesignal\b",
    r"\bcodility\b",
    r"\btestgorilla\b",
    r"\bamcat\b",

    # Interviews
    r"\binterview\b",
    r"\btechnical interview\b",
    r"\btechnical round\b",
    r"\bhr round\b",
    r"\bmanagerial round\b",
    r"\bfinal round\b",
    r"\binterview scheduled\b",
    r"\binterview invitation\b",

    # Selection
    r"\bshortlisted\b",
    r"\bselected\b",
    r"\bselection\b",
    r"\bcongratulations\b",
    r"\boffer letter\b",
    r"\boffer\b",
    r"\bjoining\b",
    r"\bonboarding\b",

    # Career events
    r"\bhackathon\b",
    r"\bworkshop\b",
    r"\bseminar\b",
    r"\bwebinar\b",
    r"\bcareer fair\b",
    r"\bplacement cell\b",

]


# ==========================================================
# Strong Ignore Keywords
# ==========================================================

IGNORE_PATTERNS = [

    # OTP
    r"\botp\b",
    r"\bone[- ]?time password\b",
    r"\bverification code\b",
    r"\bsecurity code\b",
    r"\bauthentication code\b",
    r"\blogin code\b",
    r"\b2fa\b",
    r"\bmfa\b",

    # Password
    r"\bpassword reset\b",
    r"\breset your password\b",
    r"\bforgot password\b",

    # Security
    r"\blogin alert\b",
    r"\bsecurity alert\b",
    r"\bdevice verification\b",
    r"\bnew sign[- ]?in\b",
    r"\bconfirm your email\b",
    r"\bverify your email\b",

    # Banking
    r"\btransaction\b",
    r"\bdebited\b",
    r"\bcredited\b",
    r"\bstatement\b",
    r"\bupi\b",
    r"\brefund initiated\b",

    # Shopping
    r"\border confirmed\b",
    r"\border shipped\b",
    r"\bout for delivery\b",
    r"\bdelivered\b",
    r"\btracking number\b",
    r"\binvoice\b",
    r"\breceipt\b",

    # Social
    r"\bfriend request\b",
    r"\bmentioned you\b",
    r"\bcommented\b",
    r"\bfollowed you\b",
    r"\bnew follower\b",

    # Promotions
    r"\bblack friday\b",
    r"\bcyber monday\b",
    r"\bdiscount\b",
    r"\bcoupon\b",
    r"\bsale\b",
    r"\bdeal\b",
]




def contains_pattern(text: str, patterns: list[str]) -> bool:

    text = text.lower()

    return any(
        re.search(pattern, text)
        for pattern in patterns
    )



def should_ignore(email: ParsedEmail) -> bool:

    text = " ".join([
        email.subject,
        email.sender_email,
        email.body[:3000],
    ])

    # Career emails are NEVER rejected.
    if contains_pattern(text, CAREER_PATTERNS):
        return False

    # Ignore only when we're confident.
    if contains_pattern(text, IGNORE_PATTERNS):
        return True

    # Let the LLM decide.
    return False


def filter_emails(emails: list[ParsedEmail]) -> list[ParsedEmail]:
    return [
        email
        for email in emails
        if not should_ignore(email)
    ]