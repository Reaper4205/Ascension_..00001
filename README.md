# SkillBridge

> **A Closed-Loop Academia--Industry Skill Intelligence Platform**

SkillBridge is a role-based platform designed around the SIH Problem
Statement 44 theme of strengthening collaboration between **students,
industry, and academia**.

It connects student skill assessment, skill-gap analysis, learning
recommendations, internships/opportunities, industry recruitment, and
academic industry-demand insights into one ecosystem.

------------------------------------------------------------------------

## Problem Statement

There is a gap between the skills students develop through academic
education and the skills expected by industry.

-   Students may not know which skills they need for their target
    career.
-   Industries struggle to identify candidates with the right skill
    profile.
-   Academicians have limited visibility into current industry skill
    demand and opportunities for collaboration.
-   Institutions need better insight into student readiness, skill gaps,
    internships, and placement trends.

SkillBridge addresses this gap by creating a connected flow between
**skill discovery, skill development, industry opportunities,
recruitment, and academic decision-making**.

------------------------------------------------------------------------

## Our Solution

SkillBridge creates a common skill ecosystem for three primary
stakeholders:

### 🎓 Students

-   Technical skill assessment
-   Domain Deep-Dive Assessment
-   Career/target-role selection
-   Readiness scoring
-   Industry-aligned skill-gap analysis
-   Personalized learning recommendations
-   Project and portfolio management
-   Internship/job opportunity discovery
-   Application tracking
-   Public professional profile

### 🏢 Industry / Recruiters

-   Opportunity management
-   Job and internship posting
-   Candidate discovery
-   Skill-based candidate matching
-   Applicant tracking
-   Shortlisting and recruitment workflow
-   Industry skill-demand intelligence
-   Candidate/industry feedback

### 👨‍🏫 Academicians

-   Industry demand insights
-   Curriculum gap identification
-   Student skill insights
-   Industry opportunities
-   Faculty development and training opportunities
-   Industry projects and collaboration
-   Workshops, mentorship and guest-lecture opportunities

### 🏛️ Institutions

-   Student readiness analytics
-   Skill-gap analytics
-   Department-level insights
-   Placement and internship insights
-   Industry demand trends
-   Intervention and outcome tracking

------------------------------------------------------------------------

# Core Workflow

``` mermaid
flowchart TD
    A[Industry] --> B[Define Roles & Required Skills]
    B --> C[Skill Intelligence Layer]

    C --> D[Student Assessment]
    D --> E[Readiness Score]
    E --> F[Skill Gap Analysis]
    F --> G[Personalized Recommendations]

    C --> H[Academia / Teacher Dashboard]
    H --> I[Curriculum Gap Detection]
    I --> J[Workshop / Project / Industry Intervention]

    G --> K[Student Opportunities]
    J --> K

    K --> L[Industry Recruitment]
    L --> M[Skill-Based Candidate Matching]
    M --> N[Interview / Selection]
    N --> O[Internship / Employment]

    O --> P[Industry Feedback]
    P --> C

    C --> Q[Institutional Analytics]
```

------------------------------------------------------------------------

# Student Journey

``` text
Profile
   ↓
Technical Skills Assessment
   ↓
Portfolio / Projects
   ↓
Domain Deep-Dive Assessment
   ↓
Readiness Score
   ↓
Industry Benchmark Comparison
   ↓
Skill Gap Analysis
   ↓
Personalized Recommendations
   ↓
Matched Opportunities
   ↓
Applications
   ↓
Recruitment / Internship
   ↓
Industry Feedback
```

The current prototype includes a multi-step technical assessment and a
role-specific Domain Deep-Dive Assessment. The DDD flow uses awareness,
knowledge, and experience questions to build a role-focused assessment
profile.

------------------------------------------------------------------------

# Skill Gap Analysis

SkillBridge compares a student's demonstrated profile against the
requirements associated with their target role.

Example:

  Skill          Student   Industry Requirement Status
  ------------ --------- ---------------------- ---------------
  React              88%                    80% ✅ Proficient
  JavaScript         84%                    80% ✅ Proficient
  TypeScript         52%                    70% ⚠️ Gap
  Testing            44%                    60% ⚠️ Gap

The purpose is not only to identify what a student lacks, but also to
explain **what they should do next**.

------------------------------------------------------------------------

# Personalized Recommendations

Recommendations are linked to identified skill gaps.

For example:

``` text
Target Role: Frontend Developer

Current Readiness: 62%

Major Gaps:
- TypeScript
- Testing

Recommended Path:
1. TypeScript learning module
2. Frontend testing workshop
3. Practical project
4. Re-assessment
5. Apply to suitable opportunities
```

This creates a continuous **Assess → Learn → Improve → Apply** cycle.

------------------------------------------------------------------------

# Industry Recruitment

SkillBridge extends beyond a traditional applicant-tracking system by
focusing on skill compatibility.

Recruiters can evaluate:

-   Candidate match percentage
-   Required skills
-   Candidate proficiency
-   Missing skills
-   Project evidence
-   Assessment evidence
-   Application status

Example:

``` text
Candidate: Student A

React          92% / Required 85%   ✓
JavaScript     88% / Required 80%   ✓
TypeScript     61% / Required 70%   ⚠
Testing        45% / Required 60%   ⚠

Overall Match: 87%
```

The goal is to make candidate recommendations **explainable rather than
just displaying a score**.

------------------------------------------------------------------------

# Academia--Industry Collaboration

SkillBridge connects industry requirements with academic action.

When industry demand reveals a significant skill gap, academicians can
use that insight to plan:

-   Industry workshops
-   Guest lectures
-   Industry mentorship
-   Live projects
-   Industrial training
-   Faculty development
-   Research collaboration
-   Consultancy opportunities

This transforms industry-demand data into practical academic
intervention.

------------------------------------------------------------------------

# Institutional Intelligence

Institutions can use aggregated skill data to understand:

-   Average student readiness
-   Major skill gaps
-   Industry-demand trends
-   Internship activity
-   Placement insights
-   Department-level readiness
-   Impact of academic interventions

A key concept is:

``` text
Skill Gap
    ↓
Academic / Industry Intervention
    ↓
Student Learning
    ↓
Re-assessment
    ↓
Measurable Improvement
```

------------------------------------------------------------------------

# Closed-Loop Feedback

The central differentiator of SkillBridge is the feedback loop:

``` text
Industry Requirements
        ↓
Skill Benchmarks
        ↓
Student Assessment
        ↓
Skill Gaps
        ↓
Learning & Academic Intervention
        ↓
Industry Opportunities
        ↓
Recruitment / Internship
        ↓
Industry Feedback
        ↓
Updated Skill Intelligence
        ↺
```

This allows the ecosystem to continuously learn from changing industry
requirements and student outcomes.

------------------------------------------------------------------------

# Technology

The current prototype is built primarily with:

-   HTML5
-   Tailwind CSS
-   JavaScript
-   Responsive web design
-   Browser-based application state/authentication flow

The prototype is structured so that its data entities and workflows can
be extended to a production backend/database architecture.

------------------------------------------------------------------------

# Key Modules

``` text
SkillBridge
│
├── Student
│   ├── Profile
│   ├── Technical Assessment
│   ├── Domain Assessment
│   ├── Skill Gap Analysis
│   ├── Recommendations
│   ├── Portfolio
│   ├── Opportunities
│   └── Applications
│
├── Industry
│   ├── Dashboard
│   ├── Opportunities
│   ├── Candidate Matching
│   ├── Applications
│   └── Recruitment
│
├── Academia
│   ├── Industry Demand
│   ├── Curriculum Insights
│   ├── Student Skill Insights
│   ├── Industry Opportunities
│   └── Collaboration
│
└── Institution
    ├── Skill Analytics
    ├── Placement Insights
    ├── Industry Demand
    └── Intervention Outcomes
```

------------------------------------------------------------------------

# Why SkillBridge?

### For Students

Understand where you stand, identify your skill gaps, improve them, and
discover relevant opportunities.

### For Industry

Find candidates based on actual skill compatibility instead of relying
only on resumes.

### For Academicians

Understand what industry needs and convert that information into
curriculum, workshops, projects, and collaboration.

### For Institutions

Measure student readiness and make data-informed decisions about
training, placements, and industry alignment.

------------------------------------------------------------------------

# Project Goals

-   Bridge the academia--industry skill gap
-   Improve student employability
-   Make skill assessment more meaningful
-   Enable skill-based recruitment
-   Improve industry-academia collaboration
-   Provide actionable curriculum insights
-   Connect learning with real-world opportunities
-   Create measurable skill-development outcomes

------------------------------------------------------------------------

# Team

| Team Member | Responsibility |
|---|---|
| **Likhitha** | Documentation |
| **Nishat Kausar** | Research |
| **Jyoti** | Documentation |
| **Nikhil Kumar** | Development & UI/UX |
| **RISHABH Kumar** | Development & UI/UX |
| **Pragyaansh Sagar** | Project Coordination |

# Project

**Project Name:** SkillBridge\
**SIH Problem Statement:** 44\
**Theme:** Academia--Industry Collaboration, Skill Mapping, Internships
& Placement

------------------------------------------------------------------------

# Future Scope

The prototype can be extended with:

-   Production database and backend APIs
-   Advanced AI/NLP-based skill extraction from job descriptions
-   Automated industry skill taxonomy updates
-   Real-time industry demand analytics
-   Verified skill credentials
-   Advanced recommendation models
-   Institutional integrations
-   Secure role-based access control
-   Scalable notification and communication systems

------------------------------------------------------------------------

## Vision

> **SkillBridge aims to bridge the gap between what academia teaches,
> what students know, and what industry needs --- creating a continuous
> ecosystem for skill development, collaboration, and employment.**.
