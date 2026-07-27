### Schema Diagram

                                    ┌──────────────────────────────┐
                                    │            JOBS              │
                                    ├──────────────────────────────┤
                                    │ PK  id                       │
                                    │ company                      │
                                    │ summary                      │
                                    │ role                         │
                                    │ employment_type              │
                                    │ recruitment_type             │
                                    │ location                     │
                                    │ salary                       │
                                    │ bond                         │
                                    │ job_url                      │
                                    │ experience_min               │
                                    │ recruiter_name               │
                                    │ recruiter_email              │
                                    │ applied_at                   │
                                    │ status                       │
                                    │ status_date                  │
                                    │ next_event_date              │
                                    │ resume_tailored              │
                                    │ resume_path                  │
                                    │ created_at                   │
                                    │ updated_at                   │
                                    └──────────────┬───────────────┘
                                                   │
                         ┌─────────────────────────┴─────────────────────────┐
                         │                                                   │
                    1    │                                               1   │
                         │                                                   │
                         ▼                                                   ▼
        ┌──────────────────────────────────────┐      ┌─────────────────────────────────────┐
        │                EMAILS                │      │               EVENTS                │
        ├──────────────────────────────────────┤      ├─────────────────────────────────────┤
        │ PK  gmail_message_id                 │      │ PK  id                              │
        │ FK  job_id ──────────────────────────┘      │ FK  job_id ─────────────────────────┘
        │ gmail_thread_id                      │      │ title                               │
        │ account                              │      │ description                         │
        │ status                               │      │ event_type                          │
        │ subject                              │      │ start_time                          │
        │ sender_name                          │      │ end_time                            │
        │ sender_email                         │      │ completed                           │
        │ received_at                          │      │ created_by_ai                       │
        │ processed                            │      │ created_at                          │
        │ summary                              │      │ updated_at                          │
        │ created_at                           │      └─────────────────────────────────────┘
        └──────────────────────────────────────┘



        ┌─────────────────────────────────────────────┐
        │             DAILY_SCHEDULES                 │
        ├─────────────────────────────────────────────┤
        │ PK  schedule_date                           │
        │ user_reflection                             │
        │ generated_at                                │
        └──────────────────────┬──────────────────────┘
                               │
                          1    │
                               │
                               ▼
        ┌─────────────────────────────────────────────┐
        │             SCHEDULE_ITEMS                  │
        ├─────────────────────────────────────────────┤
        │ PK  id                                      │
        │ FK  schedule_date ───────────────────────────┘
        │ title                                       │
        │ start_time                                  │
        │ end_time                                    │
        │ sort_order                                  │
        │ completed                                   │
        │ note                                        │
        └─────────────────────────────────────────────┘



### AI planner

                                   Gmail
                                   │
                                   ▼
                              EMAIL AGENT
                                   │
                                   ▼
                                   EMAILS
                                   │
                                   ▼
                                   JOBS
                                   │
                                   ▼
                                   EVENTS
                                   │
                                   │
               ┌──────────────────────┼───────────────────────────┐
               │                      │                           │
               ▼                      ▼                           ▼
          Today's Events      Yesterday's Schedule        Schedule Template
                              + Completion Notes          + Planner Prompt
               │                      │                           │
               └──────────────────────┴───────────────┬───────────┘
                                                       │
                                                       ▼
                                             ┌─────────────────┐
                                             │   AI Planner    │
                                             └─────────────────┘
                                                       │
                                                       ▼
                                             DAILY_SCHEDULE
                                                       │
                                                       ▼
                                             SCHEDULE_ITEMS
                                                       │
                                                       ▼
                                   User Completion + Task Notes
                                                       │
                                                       │
                                        (stored in database)
                                                       │
                                                       ▼
                                        Used for tomorrow's planning