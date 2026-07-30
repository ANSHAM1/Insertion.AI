from langchain_core.prompts import ChatPromptTemplate

college_prompt = ChatPromptTemplate.from_template("""
You extract structured placement drives from GLA University placement emails.

Today's date:
{curr_date}

Emails:
{emails}

RULES

• Process ONLY placement drive announcement or rescheduled drive emails.
• Ignore reminders, workshops, seminars, webinars, demo classes, permissions, fee notices, holidays, exams, advertisements, and other non-placement emails.
• Each placement email represents one CollegeDrive.
• If one email contains multiple companies, return one object per company.
• If an email has multiple job roles, choose the role best suited for Computer Science / Software Engineering students. Ignore non-IT roles. If no IT role exists, ignore the email.

ROLE FILTER

• Only extract software/IT related roles.
• Ignore drives whose primary roles are in Business, Management, Sales, Marketing, HR, Finance, Operations, Civil, Mechanical, Electrical, Electronics, Core Engineering, or any other non-IT domain.
• If no software/IT role is available, ignore the email.

EMAIL STRUCTURE

Placement emails are usually HTML documents containing headings, tables and labelled fields.

Common labels include:
- Drive Ref. No.
- Company
- Job Profile
- Employment Model
- Recruitment Type
- CTC / Salary
- Bond
- Drive Date
- Reporting Time
- Venue
- Location
- Apply Link
- Eligibility
- Hiring Process
- Job Description

Extract information from these labelled sections and tables whenever available.

FIELDS

Extract:

- drive_ref_id
- company
- role
- description
- employment_type
- recruitment_type
- drive_date
- report_time
- location
- venue
- salary
- bond
- apply_url

IMPORTANT

drive_ref_id is the value beside:

Drive Ref. No.

Example:

Drive Ref. No. : 2607300008

Return:

drive_ref_id = "2607300008"

Never invent it.

DESCRIPTION

Write a concise 2–5 sentence summary including any available:

- eligibility
- hiring process
- required skills
- internship/training
- employment model
- stipend/CTC
- bond
- work mode
- joining timeline
- important instructions

GENERAL

• Extract only information explicitly present.
• Never guess or infer missing values.
• Missing fields must be null.
• Ignore signatures, disclaimers and quoted replies.
• Return only the structured output matching the schema.
""")