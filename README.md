
# CareerAtlas AI

### AI-Powered Future Workforce Intelligence Platform

> **Mapping Tomorrow's Careers, Today.**

CareerAtlas AI is a data-driven workforce intelligence platform designed to help students, graduates, and professionals understand changing career requirements, discover geographically relevant workforce insights, identify skill gaps, and prepare for the future of work.

The platform combines occupational data, dated skill-trend signals, generative AI exposure estimates, country-level employment information, and explainable career-matching algorithms.

The deployed prototype uses a custom matching engine rather than calling a generative AI model at runtime.

**SDC Hackathon 2026 | Domain 1: Future-Ready Workforce**

---

## 1. Team Information

| Field | Details |
|---|---|
| Team Name | Africoders |
| Project / Solution Name | CareerAtlas AI |
| Domain | Domain 1: Future-Ready Workforce |
| Primary SDG | SDG 8 – Decent Work and Economic Growth |
| Secondary SDG | SDG 4 – Quality Education |
| Team Leader | Azza Ladhgham |
| University | Xiamen University Malaysia |
| Number of Members | 4 |

---

## 2. Important Links

| Resource | Link |
|---|---|
| GitHub Repository | https://github.com/azzaladgham/SDC_Hackathon |
| Replit Project | https://replit.com/join#t=affrgmxnruqoqrk-jarmxl |
| Live Prototype | https://sdc-hackathon-jarmxl.replit.app |
| Slide Deck | https://canva.link/tvpr171cn8gx1d7 |
| Demo Video | https://youtu.be/P0Omx6hmkL0?is=5r_dHMQUgeH2SjVM |
| Pitching Video | https://youtu.be/ARcQEMDXBCQ?is=O4ufKeImZ3O2UDqg |
| RunPod Endpoint | Not applicable |

---

## 3. Project Overview

### 3.1 Problem Statement

Artificial intelligence is transforming occupations and the skills required in the workforce.

However, students, graduates, and professionals often struggle to understand how these changes may affect their career choices.

Three major challenges contribute to this problem.

**1. Career Uncertainty**

Individuals may lack reliable information about changing occupational requirements, emerging skills, and future workforce developments.

**2. Skills Mismatch**

Individuals may not know how their existing skills align with occupational requirements or which additional skills they should develop.

**3. Geographical Blind Spots**

Generalized workforce information may overlook the employment characteristics and occupational structure of a user's country.

These challenges create a gap between workforce transformation and informed career planning.

### 3.2 Proposed Solution

CareerAtlas AI addresses these challenges through a workforce intelligence platform combining:

- Skills profiling
- Occupational and skills information
- Workforce trend indicators
- Location-specific employment insights
- Generative AI exposure estimates
- Personalized career matching
- Skill-gap identification
- Reskilling recommendations
- Sustainable Development Goal alignment
- Workforce uncertainty scenarios

The platform transforms complex workforce information into understandable and actionable career guidance.

### 3.3 Project Objectives

CareerAtlas AI aims to:

1. Improve awareness of emerging career and skill trends.
2. Provide personalized career guidance based on individual skills.
3. Make workforce information relevant to selected countries.
4. Identify skill gaps associated with suitable occupations.
5. Support personalized reskilling and lifelong learning.
6. Communicate AI-related occupational uncertainty responsibly.
7. Connect workforce readiness with relevant Sustainable Development Goals.

---

## 4. Key Features

### 4.1 Skills Profile Intake

Users select their skills through the web interface.

The selected skills are submitted to the backend matching engine.

The matching engine uses the submitted skills and relevant SDG preferences to generate career recommendations.

The current implementation does not require users to upload personal CVs or provide their names.

Synthetic profiles can be used for demonstration and testing.

### 4.2 Workforce Trend Intelligence

CareerAtlas AI tracks 47 selected skills using dated information derived from:

- arXiv research publications
- Hacker News hiring discussions

The system calculates a momentum indicator for each tracked skill based on changes in keyword mentions.

These indicators provide signals of research attention and hiring-discussion activity.

They should not be interpreted as direct measurements of job vacancies or guaranteed employment growth.

### 4.3 Geographical Intelligence

CareerAtlas AI includes workforce information for four countries:

- Malaysia
- Singapore
- Philippines
- Vietnam

Country-specific information is based on employment by broad occupational group.

This helps users understand the occupational structure of their selected country.

The current geographical feature focuses on country-specific information rather than direct country-to-country comparisons.

### 4.4 Personalized Career Matching

The occupational dataset contains 30 roles with associated essential skills.

The matching engine considers:

- User skill overlap
- Occupational skill requirements
- Workforce skill momentum
- Generative AI exposure information
- Scenario-based assumptions

The results include ranked career recommendations and explanations of the factors affecting each score.

### 4.5 Skill Gap Analysis

CareerAtlas AI identifies the skills required by recommended occupations that are missing from the user's selected skill profile.

This helps users understand what additional skills they may need to develop.

### 4.6 Personalized Reskilling Guidance

The reskilling component connects identified skill gaps with learning recommendations.

Pathway information may include:

- Missing skills
- Recommended learning resources
- Suggested learning order
- Estimated learning hours
- Course cost information, where available
- Relevant SDG contributions

Learning pathways are recommendations rather than guarantees of employment.

### 4.7 Generative AI Exposure Analysis

The platform incorporates occupational exposure information derived from International Labour Organization research.

These scores describe the extent to which occupational tasks may be affected by generative AI.

**Important:** AI exposure does not automatically mean job automation, unemployment, or job loss.

### 4.8 Workforce Scenarios

The matching engine supports two scenarios:

**Moderate AI-Change Scenario**

Represents a moderate level of AI-related workforce disruption.

**Fast AI-Change Scenario**

Represents faster AI-related workforce disruption.

These scenarios help users explore how different assumptions influence career recommendations.

Scenario scores are estimates, not predictions of guaranteed outcomes.

### 4.9 SDG Alignment

The project primarily supports:

**SDG 8 – Decent Work and Economic Growth**

It also contributes to:

**SDG 4 – Quality Education**

Career recommendations and reskilling guidance help users understand potential opportunities for employment and lifelong learning.

---

## 5. Our Innovation

### Geographical Intelligence

CareerAtlas AI combines occupational intelligence with employment information relevant to a user's selected location.

The platform connects:

- Individual skills
- Occupational requirements
- Workforce trend signals
- National employment structures
- AI exposure estimates
- Personalized learning guidance

Rather than presenting identical workforce information to every user, CareerAtlas AI aims to provide insights informed by the occupational structure of the selected country.

### Local Opportunity Discovery

The platform helps users explore suitable career paths that may be overlooked when relying only on generalized workforce information.

### Our Vision

To help individuals understand workforce changes relevant to their location and develop the skills needed to pursue suitable career opportunities.

---

## 6. Technology Stack

### 6.1 Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.3.1 | User interface |
| Vite | ^8.3.4 | Frontend build tool |
| Tailwind CSS | ^4.3.3 | Responsive styling |
| Framer Motion | ^14.4.0 | Interface animations |
| Recharts | ^3.10.1 | Data visualization |
| Google Fonts | Not applicable | Typography |

### 6.2 Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 22 | JavaScript runtime |
| TypeScript | 5.9 | Application development |
| Express | 5.3 | Backend API |
| Zod | 4.6 | Data validation |
| tsx | 4.23 | TypeScript execution |
| Vitest | 5.0 | Automated testing |

### 6.3 Additional Technologies

| Technology | Purpose |
|---|---|
| ESCO | Occupational and skills data |
| ISCO-08 | Occupational classification |
| ILO AI Exposure Index | Occupational AI exposure |
| arXiv | Research-based skill trends |
| Hacker News | Hiring-discussion trend signals |
| ILOSTAT | Country employment statistics |
| DOSM | Malaysian employment statistics |
| JSON | Structured data storage |
| Git | Version control |
| GitHub | Repository hosting and collaboration |
| GitHub Actions | Automated dataset updates |
| Replit | Cloud deployment |
| Claude Opus 5.5 | AI-assisted development |

### 6.4 AI Model Usage

**No generative AI model is embedded in or called by the deployed application.**

The deployed system uses a custom, explainable career-matching algorithm.

Claude Opus 5.5 was used as an AI-assisted development tool.

It is not a runtime dependency of the matching engine.

The system's career scores are calculated using structured data and defined scoring rules rather than generated by Claude.

### 6.5 Data Storage

The application uses structured JSON files.

These files contain:

- Occupational information
- Skill definitions
- Workforce trend snapshots
- AI exposure values
- Country employment statistics

The current application does not use a conventional database such as MySQL, PostgreSQL, or MongoDB.

---

## 7. System Architecture

### 7.1 Application Architecture

```text
                     USER
                      |
                      v
              CAREERATLAS AI
                WEB FRONTEND
          React + Vite + Tailwind CSS
                      |
                      | Selected skills and SDGs
                      v
                 BACKEND API
            Node.js + Express
                 TypeScript
                      |
                      v
              MATCHING ENGINE
                      |
         +------------+------------+
         |            |            |
         v            v            v
     Skill Match   Trend Data   AI Exposure
         |            |            |
         +------------+------------+
                      |
                      v
                JSON DATA LAYER
                      |
         +------------+------------+
         |            |            |
         v            v            v
        ESCO       arXiv / HN     ILO Data
     Occupations    Snapshots     Exposure
         |            |            |
         +------------+------------+
                      |
                      v
             SCENARIO SCORING
                      |
              +-------+-------+
              |               |
              v               v
           Moderate          Fast
           Scenario        Scenario
              |               |
              +-------+-------+
                      |
                      v
                 USER RESULTS
                      |
          Career Recommendations
          Skill Gap Information
          Reskilling Pathways
          Score Explanations
          SDG Information
```

### 7.2 Architecture Explanation

**1. User Interface**

Users interact with CareerAtlas AI through a React-based website.

They select relevant skills and SDG preferences.

**2. Backend API**

The React frontend sends the selected information to the Node.js/Express backend.

**3. Matching Engine**

The backend compares user skills against occupational requirements from the ESCO dataset.

**4. Workforce Trend Adjustment**

The matching engine incorporates workforce trend signals from prepared data snapshots.

**5. AI Exposure Adjustment**

Occupational exposure information from ILO research contributes to scenario scoring.

**6. Scenario Analysis**

The system calculates separate career scores under moderate and fast AI-change assumptions.

**7. Results**

The frontend displays ranked career recommendations, explanations, skill gaps, and reskilling guidance.

### 7.3 Hosting

Replit hosts the frontend and backend application.

Both are served through a single deployed application URL.

https://sdc-hackathon-jarmxl.replit.app

---

## 8. Backend API

CareerAtlas AI uses Express.js and TypeScript to connect the frontend with the matching engine and structured datasets.

### 8.1 Internal API

The frontend communicates with the application's own backend.

The matching engine processes selected skills and SDG preferences and returns career recommendations.



The technical design has previously described the following routes:

| Endpoint | Method | Intended Purpose |
|---|---|---|
| `/match` | POST | Generate career recommendations |
| `/snapshots/latest` | GET | Retrieve the latest trend snapshot |
| `/pathway` | POST | Generate reskilling pathways |

These routes should be treated as documented design routes until verified against the deployed implementation.

### 8.2 External APIs

**The deployed matching engine does not require external API calls.**

It reads prepared data files stored with the project.

External sources such as ESCO, arXiv, and Hacker News have been used in the data preparation and snapshot-generation workflow.

These are distinct from runtime requests made by the deployed application.

### 8.3 API Response Information

Career-matching results may include:

- Ranked occupations
- Career scores
- Moderate scenario scores
- Fast scenario scores
- Skill overlap
- Trend contributions
- AI exposure contributions
- Existing skills
- Missing skills
- Snapshot dates
- Reskilling recommendations

---

## 9. Career Matching Algorithm

CareerAtlas AI uses an explainable career-matching algorithm that considers existing skills, workforce trends, and occupational exposure to generative AI.

### 9.1 Scoring Formula

The documented conceptual scoring formula is:

```text
Career Score =
    Skill Overlap × (1 + Scenario Weight × Skill Momentum)
    − AI Exposure Penalty
```

The exact implementation, normalization, weights, and penalty calculations should be verified against the matching-engine source code.

### 9.2 Skill Overlap

Skill overlap measures how closely the user's selected skills match the essential skills required by an occupation.

### 9.3 Skill Momentum

Skill momentum represents changes in keyword mentions associated with relevant skills.

Momentum values are calculated using dated workforce trend snapshots.

### 9.4 Scenario Weight

Scenario weighting adjusts how strongly workforce trends influence career scores.

The system supports moderate and fast AI-change scenarios.

### 9.5 AI Exposure Penalty

The matching algorithm incorporates occupational generative AI exposure as an input to career ranking.

Exposure information comes from ILO research.

Exposure does not directly represent the probability of job loss.

### 9.6 Explainable Recommendations

The system provides a breakdown of career scores so users can understand why an occupation was recommended.

This improves transparency and supports informed career decisions.

---

## 10. Data Sources and Methodology

### 10.1 ESCO Occupational Data

CareerAtlas AI uses the European Skills, Competences, Qualifications and Occupations classification.

The occupational dataset includes:

- 30 occupations
- Essential skills associated with each occupation
- ESCO occupation identifiers
- ESCO skill identifiers
- ISCO-08 occupation codes
- Generative AI exposure values

Most occupations were obtained using the ESCO web service API during dataset preparation.

Mechanical engineer and civil engineer were added using the ESCO v1.2.1 CSV dataset when the API was unavailable.

Stable ESCO identifiers connect occupations and skills.

### 10.2 Workforce Trend Data

CareerAtlas AI tracks 47 selected skills.

Two sources were used to prepare trend information.

**arXiv**

Research publication counts matching tracked skill keywords.

**Hacker News Algolia**

Keyword mentions in monthly "Ask HN: Who is hiring?" discussions.

These sources provide dated indicators of skill-related activity.

They do not directly measure national hiring demand.

### 10.3 Skill Momentum Calculation

The system compares two consecutive periods:

- Recent period: Last 3 months
- Prior period: Previous 3 months

The documented formula is:

```text
Momentum = (Recent - Prior) / max(Prior, 10)
```

Momentum values are restricted to:

```text
-1 to +1
```

Momentum is calculated separately for each source.

Only sources with at least 30 total mentions across the two periods contribute to the final momentum average.

If no source meets the threshold, momentum is set to zero.

This reduces the effect of extremely small mention counts.

### 10.4 Dated Trend Snapshots

Trend data is stored in dated JSON snapshots.

The documented snapshots include:

| Snapshot Date | Description |
|---|---|
| 2026-10-24 | Data snapshot collected on that date |
| 2026-07-24 | Historical snapshot reconstructed from historical API data |

The historical snapshot was reconstructed on October 24, 2026.

Its retrieval timestamp reflects the reconstruction date, not the historical reference date.

Each snapshot includes source URLs and retrieval timestamps.

### 10.5 Generative AI Exposure Data

AI exposure scores are derived from:

**International Labour Organization**

*Generative AI and Jobs: A Refined Global Index of Occupational Exposure.*

ILO Working Paper 140, May 2025.

The source exposure dataset contains scores for 196 ISCO-08 four-digit occupations.

Scores range from 0 to 1.

For CareerAtlas AI's 30 occupations:

- 26 roles use exact ILO occupation exposure scores.
- 4 roles use estimates derived from related occupational groups.

The four estimated roles are:

- Nurse
- Secondary school teacher
- Mechanical engineer
- Civil engineer

Estimated scores are explicitly labelled.

AI exposure describes potential interaction between generative AI and occupational tasks. It does not directly measure unemployment or job losses.

### 10.6 Country Employment Data

The project includes employment information for four countries.

| Country | Reference Year | Source |
|---|---|---|
| Malaysia | 2024 | Department of Statistics Malaysia |
| Singapore | 2025 | ILOSTAT |
| Philippines | 2024 | ILOSTAT |
| Vietnam | 2024 | ILOSTAT |

The country data describes employment across ISCO-08 major occupational groups.

Each record includes:

- Employment counts
- Share of total employment
- Reference year
- Source information
- Source URL

Malaysia uses DOSM data because the relevant ILOSTAT occupation breakdown available during data preparation was outdated.

### 10.7 Country Data Validation

The country-data processing script checks:

- Required occupational groups
- Employment totals
- Occupational-group coverage
- Source information
- Reference years

Occupational-group totals must agree with the reported national total within 1%.

Incomplete records are rejected where a complete breakdown is required.

---

## 11. Project Structure

The documented repository structure includes:

```text
SDC_Hackathon/
|
|-- .github/
|   |-- workflows/
|       |-- refresh-snapshot.yml
|
|-- data/
|   |-- raw/
|   |   |-- arxiv-cache.json
|   |   |-- trends-2026-07-24.json
|   |   |-- trends-2026-10-24.json
|   |
|   |-- snapshots/
|   |   |-- 2026-07-24.json
|   |   |-- 2026-10-24.json
|   |
|   |-- snapshots 2/
|   |
|   |-- sources/
|   |   |-- malaysia-dosm.json
|   |
|   |-- countries.json
|   |-- esco.json
|   |-- exposure.json
|   |-- skill-candidates.json
|   |-- tracked-skills.json
|
|-- scripts/
|   |-- build-country-data.ts
|   |-- build-tracked-skills.ts
|   |-- check-coverage.ts
|   |-- fetch-esco.ts
|   |-- fetch-trends.ts
|   |-- join-exposure.ts
|   |-- list-skill-candidates.ts
|   |-- parse-ilo-exposure.ts
|   |-- pdf-to-text.ts
|   |-- swap-roles.ts
|   |-- validate-data.ts
|   |-- package.json
|   |-- package-lock.json
|   |-- tsconfig.json
|
|-- server/
|   |-- data/
|   |   |-- automation-exposure.json
|   |
|   |-- mocks/
|   |   |-- snapshots/
|   |   |   |-- 2026-09-20.json
|   |   |   |-- 2026-10-20.json
|   |   |-- profiles.json
|   |   |-- role-overrides.json
|   |
|   |-- src/
|   |   |-- config.ts
|   |   |-- data.ts
|   |   |-- index.ts
|   |   |-- pathway.test.ts
|   |   |-- pathway.ts
|   |   |-- realdata.test.ts
|   |   |-- scoring.test.ts
|   |   |-- scoring.ts
|   |
|   |-- package.json
|   |-- package-lock.json
|   |-- tsconfig.json
|   |-- README.md
|
|-- shared/
|   |-- types.ts
|
|--submissions/
    |--1. SDC2026_Africoders_Preliminary.pdf
    |--ProofOfReplitUSE.pdf
    |--SDC2026_Africoders_TechnicalDeclaration.pdf
|
|-- web/
|   |-- public/
|   |   |-- characters/
|   |   |   |-- scout1.png
|   |   |   |-- scout2.png
|   |   |-- favicon.svg
|   |   |-- icons.svg
|   |
|   |-- src/
|   |   |-- assets/
|   |   |   |-- hero.png
|   |   |   |-- react.svg
|   |   |   |-- vite.svg
|   |   |
|   |   |-- components/
|   |   |   |-- BreakdownBar.tsx
|   |   |   |-- CountryScreen.tsx
|   |   |   |-- Disclaimer.tsx
|   |   |   |-- IntakeForm.tsx
|   |   |   |-- NameScreen.tsx
|   |   |   |-- PathwayView.tsx
|   |   |   |-- ProfilePicker.tsx
|   |   |   |-- RoleDetail.tsx
|   |   |   |-- ScoreRange.tsx
|   |   |   |-- SdgChip.tsx
|   |   |   |-- SkillsScreen.tsx
|   |   |   |-- SourceBadge.tsx
|   |   |   |-- TrendChart.tsx
|   |   |
|   |   |-- data/
|   |   |   |-- 2026-07-24.json
|   |   |   |-- 2026-10-24.json
|   |   |   |-- countries.json
|   |   |   |-- esco.json
|   |   |   |-- exposure.json
|   |   |
|   |   |-- mocks/
|   |   |   |-- data.ts
|   |   |   |-- skills.ts
|   |   |
|   |   |-- api.ts
|   |   |-- App.tsx
|   |   |-- index.css
|   |   |-- main.tsx
|   |   |-- utils.ts
|   |
|   |-- .gitignore
|   |-- eslint.config.js
|   |-- index.html
|   |-- package.json
|   |-- package-lock.json
|   |-- README.md
|   |-- tsconfig.app.json
|   |-- tsconfig.json
|   |-- tsconfig.node.json
|   |-- vite.config.ts
|
|-- .gitattributes
|-- .gitignore
|-- .replit
|-- LICENSE
|-- package-lock.json
|-- README.md
|-- start.sh
```



---

## 12. Automated Data Updates

CareerAtlas AI uses GitHub Actions to support regular updates to workforce trend snapshots.

### 12.1 Update Schedule

The documented workflow is configured to run:

**Every Monday at 02:00 UTC**

Workflow file:

```text
.github/workflows/refresh-snapshot.yml
```

### 12.2 Update Process

1. GitHub Actions starts the scheduled workflow.
2. The trend-fetching script requests updated information.
3. The system calculates skill momentum.
4. A new dated snapshot is generated.
5. A pull request is opened.
6. A team member reviews and merges the changes.

The workflow does not push directly to the protected `main` branch.

### 12.3 Failure Handling

If an external request fails after retries, the script does not write an incomplete snapshot.

Previously saved snapshots remain available.

The workflow can also be started manually from GitHub Actions.

---

## 13. Data Validation

CareerAtlas AI includes a validation script.

The documented command is:

```bash
cd scripts
npx tsx validate-data.ts
```

The script checks:

- Occupation identifiers
- Essential skill references
- ISCO-08 codes
- Exposure score ranges
- Tracked skill definitions
- Snapshot dates
- Momentum ranges
- Mention counts
- Source URLs
- Retrieval timestamps
- Country employment totals
- Occupational-group coverage

Validation fails when required data is missing or inconsistent.

---

## 14. Installation and Setup

### 14.1 Prerequisites

Install:

- Git
- Node.js 22
- npm

### 14.2 Clone the Repository

```bash
git clone https://github.com/azzaladgham/SDC_Hackathon.git
```

### 14.3 Navigate to the Project

```bash
cd SDC_Hackathon
```

### 14.4 Install Dependencies

The documented frontend directory is `web`.

```bash
cd web
npm install
```

### 14.5 Start the Application

```bash
npm run dev
```

Use the startup script defined in the application's `package.json` if the command differs.


### 14.6 Open the Application

Open the local URL displayed by the development server.

A typical Vite development URL is:

```text
http://localhost:5173/
```

The actual address depends on the project configuration.

### 14.7 Run Data Validation

From the repository root:

```bash
cd scripts
npm install
npx tsx validate-data.ts
```

### 14.8 Refresh Trend Data

From the `scripts` directory:

```bash
npx tsx fetch-trends.ts
```

This command is intended for the data preparation workflow, not for ordinary users of the deployed application.

### 14.9 Run Tests

The project uses Vitest 5.0.5



A typical Vitest project uses:

```bash
npm test
```

This command should be included as the official instruction only if the repository defines the corresponding script.

---

## 15. Reproducing the Data

The project includes scripts for rebuilding and validating its datasets.

Install script dependencies:

```bash
cd scripts
npm install
```

### Occupational Data

```bash
npx tsx fetch-esco.ts
```

Alternative ESCO CSV workflow:

```bash
npx tsx swap-roles.ts "<path to ESCO v1.2.1 CSV folder>"
npx tsx join-exposure.ts "<path to occupations_en.csv>"
```

### Country Employment Data

Download the relevant ILOSTAT bulk dataset:

```text
EMP_TEMP_SEX_OCU_NB_A
```

Then run:

```bash
npx tsx build-country-data.ts "<path to unzipped ILOSTAT CSV>"
```

### AI Exposure Data

```bash
npx tsx pdf-to-text.ts "<path to ILO PDF>" "<path to output text>"
npx tsx parse-ilo-exposure.ts
```

### Skill Tracking and Trends

```bash
npx tsx build-tracked-skills.ts
npx tsx fetch-trends.ts
npx tsx check-coverage.ts
npx tsx validate-data.ts
```

These commands are intended for maintaining or reproducing the data pipeline.

They are not required simply to open the deployed web application.

---

## 16. Replit Deployment

CareerAtlas AI uses **Replit as its deployment platform**.

Replit hosts the working prototype and makes the frontend and backend accessible through a single URL.

### Purpose of Replit

**Application Hosting**

Replit provides the cloud environment for the web application.

**Live Prototype Demonstration**

Users can access the deployed platform through a browser.

**Testing**

The deployed environment supports testing outside the local development environment.

**Accessibility**

Users do not need to install development tools to use the public prototype.

### Deployment Information

| Field | Details |
|---|---|
| Provider | Replit |
| Purpose | Frontend and backend hosting |
| Plan | SDC Hackathon sponsor-provided credits |
| Deployment URL | https://sdc-hackathon-jarmxl.replit.app |

---

## 17. Privacy and Data Handling

CareerAtlas AI is designed to minimize the personal information processed by the matching engine.

### Information Sent to the Matching Engine

The matching engine receives:

- Selected skills
- Relevant SDG preferences

The matching engine does not require:

- User names
- Email addresses
- Phone numbers
- Personal CV documents

### Data Storage

The application uses local project data files containing public workforce information.

It does not use a database to store user profiles.

### Third-Party Data Sharing

The application does not intentionally transmit user skills or SDG selections to external AI model providers.

The matching engine does not call Claude or other external AI services at runtime.

The project does not intentionally store submitted user selections.

### Hosting Considerations

The application is hosted on Replit.

Hosting infrastructure may generate technical access logs independently of the application's matching logic.

The use of externally hosted assets, such as Google Fonts, may also involve ordinary browser requests to those providers.

These infrastructure considerations should not be confused with application-level storage of user profiles.

---

## 18. Challenges and Learnings

### Challenge 1: External Data Availability

**Problem**

External data services may be temporarily unavailable or limit requests.

The ESCO API was unavailable when two engineering occupations were being added.

**Solution**

The team used the ESCO v1.2.1 CSV download as an alternative source.

**Learning**

Reliable data pipelines should support alternative sources and preserve source traceability.

### Challenge 2: Incomplete Country Data

**Problem**

Some country datasets contained incomplete occupational breakdowns or outdated information.

**Solution**

The team implemented validation rules and used DOSM data for Malaysia.

**Learning**

Data completeness, source quality, and reference dates are essential for meaningful workforce analysis.

### Challenge 3: Misleading Trend Indicators

**Problem**

Small keyword-mention counts can produce misleading percentage changes.

**Solution**

The team introduced a minimum mention threshold and restricted momentum scores to a defined range.

**Learning**

Trend indicators require safeguards and clear explanations of their limitations.

### Challenge 4: Missing AI Exposure Scores

**Problem**

Some occupations did not have an exact matching exposure score in the ILO dataset.

**Solution**

The team estimated exposure using related occupational groups and labelled those estimates.

**Learning**

Estimated values should be distinguished from directly observed or published values.

---

## 19. Known Limitations

### 19.1 Trend Data Is Not Direct Hiring Demand

arXiv publication counts reflect research attention.

Hacker News discussions reflect a particular segment of the technology employment community.

Neither directly measures national job vacancies.

### 19.2 Uneven Skill Coverage

The documented latest snapshot contains non-zero momentum for 28 of 47 tracked skills.

Some occupations have limited or unavailable trend information.

### 19.3 Technology-Centered Data Sources

Research and hiring-discussion sources provide richer signals for technology-related skills and occupations.

Other industries may be less comprehensively represented.

### 19.4 Broad Occupational Categories

Country employment information is available at the major occupational-group level.

Different roles within the same broad group may therefore share the same country-level employment context.

### 19.5 Employment Is Not Vacancy Demand

Employment counts do not directly indicate how many vacancies are available or how quickly an occupation is growing.

### 19.6 Different Data Reference Years

Country datasets have different reference years and publishers.

The application retains source and year information.

### 19.7 AI Exposure Is Not Job Loss

Occupational exposure scores do not directly predict unemployment or complete automation.

### 19.8 Career Scores Are Estimates

Career matching and scenario scores should not be interpreted as guaranteed outcomes.

### 19.9 Cached Data

When external data collection fails, previously generated snapshots may be used.

---

## 20. Expected Impact

CareerAtlas AI aims to improve career awareness and future workforce readiness.

### Individual Impact

- Improve understanding of changing career requirements.
- Help users identify skill gaps.
- Encourage proactive career planning.
- Support personalized reskilling and lifelong learning.

### Local Workforce Impact

- Improve access to country-specific workforce information.
- Increase awareness of relevant occupational opportunities.
- Support better alignment between individual skills and workforce requirements.

### SDG Impact

**SDG 8 – Decent Work and Economic Growth**

Supports workforce readiness and informed career development.

**SDG 4 – Quality Education**

Supports lifelong learning and skills development.

### Proposed Evaluation Target

The project's proposed evaluation target is for **at least 80% of test users** to identify one suitable local career opportunity and receive a relevant personalized reskilling pathway.

This is a proposed target, not a measured result.

---

## 21. Future Improvements

Planned improvements include:

1. Cross-country career comparisons.
2. Interactive geographical maps.
3. Advanced workforce visualizations.
4. Enhanced local opportunity discovery.
5. Expanded country coverage.
6. Improved personalized career matching.
7. Additional reskilling resources.
8. More detailed workforce scenario analysis.
9. Broader labour-market data sources.
10. Enhanced interactive career analytics.

These improvements are part of the future development roadmap and should not be confused with the current prototype's implemented features.

---

## 22. Project Status

**Current Stage: Working Prototype – Deployed Using Replit**

### Implemented and Documented Components

- Occupational dataset containing 30 roles.
- Skill tracking for 47 selected skills.
- Dated workforce trend snapshots.
- Country employment information for four countries.
- ILO-based generative AI exposure scores.
- Career matching and ranking.
- Skill gap identification.
- Moderate and fast AI-change scenarios.
- Explainable career score breakdowns.
- Reskilling guidance.
- SDG-related information.
- JSON-based data storage.
- Dataset validation scripts.
- GitHub Actions data refresh workflow.
- React-based web interface.
- Node.js/Express backend.
- Replit deployment.

### Not Used in the Deployed Matching Engine

- Runtime Claude API calls.
- Runtime generative AI model inference.
- A conventional user-profile database.
- External API requests required for every career-matching operation.

### Future Development

- Interactive world maps.
- Direct cross-country comparisons.
- Expanded geographical coverage.
- More advanced workforce analytics.
- More detailed reskilling pathways.

---

## 23. Team Roles and GitHub Usernames

| Team Member | Role | GitHub Username | Contribution |
|---|---|---|---|
| Azza Ladhgham | Team Leader | [@azzaladgham](https://github.com/azzaladgham) | Frontend |
| Kiiru Mark | Member | [@Mxrkinnit](https://github.com/Mxrkinnit) | Data Pipeline |
| Merhaben Ali | Member | [@AliMerhaben](https://github.com/AliMerhaben) | Matching Engine and API |
| Omar Jamal | Member | [@jamalmbarak](https://github.com/jamalmbarak) | Documentation |

---

## 24. Third-Party Libraries and Licenses

### Software Libraries

| Name | Type | License |
|---|---|---|
| Node.js | Runtime | MIT |
| TypeScript | Programming language | Apache 2.0 |
| Express | Backend framework | MIT |
| Zod | Validation library | MIT |
| tsx | TypeScript execution | MIT |
| Vitest | Testing framework | MIT |
| React | Frontend library | MIT |
| Vite | Build tool | MIT |
| Tailwind CSS | CSS framework | MIT |
| Recharts | Visualization library | MIT |
| Fuse.js | Fuzzy matching library | Apache 2.0 |

### Datasets and Other Resources

| Name | Type | License / Usage Terms |
|---|---|---|
| ESCO | Occupational and skills dataset | CC BY 4.0 |
| ISCO-08 | Occupational classification | ILO usage terms |
| ILO AI Exposure Data | Research dataset | ILO publication/data reuse terms |
| ILOSTAT | Employment dataset | ILOSTAT data usage terms |
| DOSM Employment Data | Employment dataset | DOSM data usage terms |
| arXiv | Research source | API and content-specific terms |
| Hacker News Algolia | Discussion search source | API/provider usage terms |
| Replit | Cloud platform | Replit service terms |
| Claude Opus 5.5 | AI-assisted development tool | Anthropic usage terms |

**Important:** Dataset licensing descriptions should be verified against the relevant original publishers before final submission.

The Apache 2.0 license of this repository does not automatically apply to third-party datasets or libraries.

---

## 25. Official SDC Sponsor Resources

**Did the project use an official SDC sponsor-provided GenAI API or cloud platform?**

**Yes.**

### Sponsor-Provided Cloud Resource

**Service:** Replit

**Resource:** Cloud development and deployment credits provided through the SDC Hackathon.

**Purpose:**

The team used Replit to host and deploy the CareerAtlas AI working prototype.

The deployed environment makes the application accessible through a web browser.

### Generative AI API Usage

The deployed application does not use a sponsor-provided generative AI API.

Claude Opus 5.5 was used as an AI-assisted development tool rather than a runtime model integrated into the deployed matching engine.

---

## 26. Submission Checklist

- [x] Product Requirements Document completed and verified
- [x] Pitch deck link added
- [x] Working prototype developed
- [x] Prototype deployed using Replit
- [x] Live prototype link added and tested
- [x] Technical Tools Declaration drafted
- [x] Third-party resource licenses fully verified
- [x] Public GitHub repository created
- [x] README.md finalized and pushed
- [x] Demo video recorded and linked
- [x] Pitching video uploaded and linked
- [x] Required submission documents prepared
- [x] All submission links verified



---

## 27. Data Sources and References

### ESCO

European Commission.

European Skills, Competences, Qualifications and Occupations.

https://esco.ec.europa.eu/

### International Labour Organization

*Generative AI and Jobs: A Refined Global Index of Occupational Exposure.*

ILO Working Paper 140, May 2025.

https://www.ilo.org/

### ILOSTAT

International Labour Organization labour statistics.

https://ilostat.ilo.org/

### Department of Statistics Malaysia

Department of Statistics Malaysia.

https://www.dosm.gov.my/

### arXiv

Research publication API.

https://info.arxiv.org/help/api/

### Hacker News Algolia

Hacker News search API.

https://hn.algolia.com/api

### Additional Background Research

Demombynes, G., Langbein, J., & Weber, M. (2025).

*The Exposure of Workers to Artificial Intelligence in Low- and Middle-Income Countries.*

World Bank Policy Research Working Paper No. 11057.

---

## 28. License

This repository includes an **Apache License 2.0** license file.

See [LICENSE](LICENSE) for details.

Third-party libraries, datasets, and other resources remain subject to their respective licenses and usage terms.




