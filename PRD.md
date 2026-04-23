

- frontend + backend,
- local-first prototype on MacBook M4,
- open-source model stack using free APIs like groq ,open router etc. ,
- low-hallucination RAG,
- company-specific legal research and litigation assistance,
- strong citation and case-detail display,
- future-ready architecture for VPC/AWS deployment.
 
---
 
# PRD: Company-Specific Legal AI RAG System for Indian Case Data
 
## 1. Product Name
**LegalAID**  
Internal AI-powered legal research, drafting, and litigation assistance platform for company-specific Indian legal cases.
 
---
 
# 2. Executive Summary
 
Build a full-stack Legal AI system that ingests already scraped company-related Indian case data from yearly JSON files, processes and stores it in a structured and searchable form, and provides a user-friendly web application for:
 
- semantic legal search,
- grounded question answering,
- case summaries,
- citation-based recommendations,
- notice/reply/case brief drafting,
- litigation timeline and matter tracking,
- supporting vs opposing precedent analysis,
- risk-oriented legal research support.
 
The system must:
- use **open-source models**,
- run initially on a **MacBook M4 local environment**,
- support **future model swapping** and infrastructure upgrades,
- minimize hallucination through grounded retrieval and citation-first generation,
- support **English**, with optional **Hindi** capability,
- provide a polished minimalist UI with **glassmorphism/neumorphism-inspired design**.
 
---
 
# 3. Problem Statement
 
The company has historical legal case data spread across yearly JSON files from Indian courts. This data is difficult to search, compare, summarize, and use effectively for ongoing litigation and legal decision support.
 
Current pain points:
- case information is fragmented and difficult to query naturally,
- business and legal teams cannot quickly retrieve relevant precedents,
- manual legal research is slow,
- generating briefs, notices, and internal summaries is repetitive,
- there is no centralized interface to search company-specific litigation patterns across years/courts,
- legal AI systems often hallucinate and fail to provide reliable case-grounded outputs.
 
The platform should solve this by transforming raw scraped legal data into a structured, searchable, citation-grounded legal intelligence system.
 
---
 
# 4. Goals
 
## 4.1 Primary Goals
1. Allow users to search company-related legal cases using natural language.
2. Return **relevant cases with exact citations and case details**.
3. Generate **grounded legal answers** strictly from retrieved evidence.
4. Support **legal drafting use cases**:
   - notices,
   - replies,
   - case briefs,
   - internal memos.
5. Assist with **ongoing litigation management** using timelines, case history, and risk cues.
6. Build a **full product** including frontend, backend, ingestion, indexing, retrieval, generation, and admin/config capabilities.
7. Keep the system **modular**, **open-source**, and **model-swappable**.
 
## 4.2 Secondary Goals
1. Provide role-based views for:
   - legal team,
   - compliance,
   - business/leadership users.
2. Support future deployment to VPC/AWS.
3. Add optional bilingual support for Hindi.
4. Enable analytics around company litigation patterns over time.
 
---
 
# 5. Non-Goals for V1
1. Predictive litigation outcome modeling with legal-grade statistical certainty.
2. Automatic court filing integration.
3. Real-time external legal database access.
4. Multi-company tenant architecture.
5. End-to-end OCR pipeline for scanned PDFs unless documents are later added.
6. Autonomous legal advice without human review.
 
---
 
# 6. User Personas
 
## 6.1 In-House Legal Counsel
Needs:
- precise precedent search,
- legal research answers,
- drafting support,
- citation-grounded outputs,
- matter summaries and strategy notes.
 
## 6.2 Compliance Team
Needs:
- simplified explanation of ongoing matters,
- acts/sections and case status visibility,
- alerts on legal trends/patterns,
- concise case summaries with confidence.
 
## 6.3 Business / Leadership Users
Needs:
- plain-English explanation of cases,
- litigation timelines,
- risk-oriented summaries,
- high-level reports and precedent-backed overviews.
 
---
 
# 7. Product Scope
 
## 7.1 Core Modules
1. **Data ingestion and normalization**
2. **Case storage and indexing**
3. **Legal semantic + keyword search**
4. **RAG-based legal QA**
5. **Draft generation**
6. **Case detail explorer**
7. **Litigation timeline and comparison views**
8. **Admin/config/model management**
9. **Evaluation and observability**
 
---
 
# 8. Key User Stories
 
## Search & Discovery
- As a legal user, I want to ask “Show all Allahabad High Court cases involving Adani Enterprises related to mandamus from 2020 onwards.”
- As a business user, I want a simple summary of all similar disputes the company has faced.
- As a compliance user, I want to filter by court, state, act, year, stage, and company role.
 
## Grounded QA
- As a legal user, I want to ask “What arguments have succeeded in similar writ matters against the company?”
- As a legal user, I want answers with exact supporting passages and citations.
- As a business user, I want a concise answer with confidence score and a simpler explanation mode.
 
## Drafting
- As a legal user, I want to generate a notice/reply draft based only on relevant past company cases.
- As a legal user, I want a case brief generated from a selected matter.
- As a legal user, I want a legal memo with supporting and opposing precedents.
 
## Litigation Management
- As a legal user, I want a timeline of hearings/orders for a matter.
- As a legal user, I want to compare similar matters side by side.
- As leadership, I want a matter summary dashboard.
 
---
 
# 9. Functional Requirements
 
## 9.1 Data Ingestion
The system must:
- accept yearly JSON files as input,
- parse nested JSON structures,
- normalize fields into canonical schema,
- validate malformed entries,
- deduplicate repeated case records,
- version imported data,
- support incremental re-ingestion when a year file is updated,
- capture ingestion logs and errors.
 
### Supported input
- One JSON file per year
- 1000–3000 cases per year
- 20–25 years total
- Approx. 20,000–75,000 cases total
 
---
 
## 9.2 Data Normalization
The system must convert raw data into normalized legal entities:
 
### Canonical Case Record
- case_id
- cino / cnr
- state / court
- bench_id
- bench_type
- judicial_branch
- district
- year
- filing_number
- filing_date
- registration_number
- registration_date
- petitioner
- respondent
- matched_company_tags
- company_role
- advocates
- acts
- stage_of_case
- first_hearing_date
- next_hearing_date
- coram
- case_status_raw
- raw_json_reference
- created_at / updated_at
 
### Related entities
- hearing history
- orders metadata
- objections
- document references
- extracted facts
- extracted issues
- extracted procedural posture
- outcome if inferable
- citations / precedents if available later
 
---
 
## 9.3 Search
The system must support:
- natural language search,
- keyword search,
- exact legal phrase search,
- metadata filtering,
- faceted filtering,
- sorted results,
- relevance-scored retrieval.
 
### Filters
- court/state
- year
- judge
- bench type
- act
- stage of case
- company tag
- petitioner/respondent
- filing/registration date
- hearing date range
 
### Search Results Must Display
- case title
- court
- year
- filing/registration number
- matched company tag
- stage
- top relevant excerpt
- why it matched
- confidence/relevance score
- quick action buttons:
  - open case
  - summarize
  - compare
  - ask AI
 
---
 
## 9.4 Case Detail Page
The UI must show:
- full structured case details,
- petitioner/respondent,
- court metadata,
- acts/sections,
- case status,
- hearing history timeline,
- order list,
- objections,
- AI-generated summary,
- extracted legal issues,
- related similar cases,
- cited passages used in AI answers.
 
---
 
## 9.5 RAG Question Answering
The system must:
- answer only from retrieved case evidence,
- provide exact citations,
- display source excerpts,
- show confidence score,
- abstain where evidence is insufficient.
 
### Answer output structure
- direct answer
- confidence score
- supporting cases
- quoted passages
- extracted relevant passages
- case comparison if useful
- “limitations / insufficient evidence” note
- optional plain-English summary
 
### Modes
1. **Research Mode**
   - conservative
   - evidence-first
   - no strategic speculation
 
2. **Advisory Mode**
   - recommendation-oriented
   - must still cite retrieved evidence
   - clearly label reasoning as AI-assisted, not legal opinion
 
3. **Executive Mode**
   - simple summary for leadership/business users
 
---
 
## 9.6 Draft Generation
The system must generate:
- notice drafts,
- reply drafts,
- case briefs,
- legal memos,
- issue lists,
- argument maps,
- supporting vs opposing precedent tables.
 
### Drafting rules
- must use retrieved evidence,
- must include cited cases where relevant,
- must mark placeholders where evidence is missing,
- must support export to DOCX/PDF in future,
- must allow users to edit in UI.
 
---
 
## 9.7 Comparison & Analysis
The system must support:
- side-by-side comparison of cases,
- timeline comparison,
- supporting vs opposing precedent matrix,
- matter similarity exploration,
- trend analysis by year/court/stage.
 
---
 
## 9.8 Risk Score
The system may provide a **heuristic risk score** in V1, clearly labeled as indicative only.
 
Potential factors:
- stage of case
- frequency of similar adverse matters
- repeated forum/judge pattern
- hearing progression
- procedural issues/objections
- prior similar case outcomes if available
 
This should not be presented as a legal prediction engine in V1.
 
---
 
## 9.9 Role-Based Access
Roles:
- Admin
- Legal Team
- Compliance
- Business / Leadership
 
Capabilities differ by role:
- Admin: ingestion, configuration, user management
- Legal: full search, drafting, advanced outputs
- Compliance: summaries, filters, limited drafting
- Business: executive summaries, restricted detail access if required
 
---
 
## 9.10 Admin Console
Must support:
- upload/import year JSON files,
- track ingestion runs,
- configure model endpoints,
- configure retrieval strategy,
- manage prompts/templates,
- manage user roles,
- view logs and system health,
- reindex data.
 
---
 
# 10. Non-Functional Requirements
 
## 10.1 Performance
- Search response: < 2–4 seconds for typical queries
- RAG answer response: < 6–15 seconds on local prototype depending on model
- Case detail page load: < 2 seconds after cache warmup
 
## 10.2 Scalability
- Handle 20k–75k cases comfortably
- Modular architecture to move from local to cloud deployment
- Swappable vector DB / model providers
 
## 10.3 Reliability
- ingestion should be resumable,
- indexing should be repeatable,
- retrieval should degrade gracefully if model unavailable.
 
## 10.4 Security
- role-based access control
- encrypted storage where practical
- secure secrets management
- audit logs for user actions
- document/case access restrictions if needed later
 
## 10.5 Maintainability
- modular service design
- typed interfaces
- test coverage
- config-driven architecture
- observability hooks
- clean API contracts
 
---
 
# 11. Recommended System Architecture
 
## 11.1 High-Level Architecture
 
### Frontend
- React / Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui or custom design system
- glassmorphism/neumorphism-inspired minimal interface
 
### Backend API
- Python FastAPI
- Pydantic
- SQLAlchemy / SQLModel
- background jobs for ingestion/indexing
 
### Data Layer
- PostgreSQL for canonical structured data
- pgvector or Qdrant for vector search
- OpenSearch or PostgreSQL full-text for keyword/BM25-like retrieval
 
### ML / AI Layer
- embedding model service
- reranker service
- LLM generation service
- evaluation service
 
### Ingestion Layer
- JSON parser
- schema normalizer
- metadata extractor
- chunker
- indexer
 
### Optional async/task queue
- Celery / Dramatiq / RQ
- Redis for queue/cache
 
For local prototype, Redis can be optional at first.
 
---
 
# 12. Storage Recommendation
 
Given your data size and local-first constraints, my recommendation is:
 
## Preferred V1 Stack
### PostgreSQL + pgvector
Why:
- strong structured querying for legal metadata,
- single primary DB for simpler local prototype,
- vector support via pgvector,
- easier operational overhead than running many services,
- good enough for your scale.
 
### Optional hybrid search augmentation
Use PostgreSQL full-text search or later OpenSearch if needed.
 
## Why not overcomplicate V1?
Your corpus size is moderate, not massive. A well-designed PostgreSQL + pgvector setup is enough for:
- metadata filtering,
- exact querying,
- vector retrieval,
- hybrid ranking.
 
## Suggested migration path later
- Start: PostgreSQL + pgvector
- Scale-up later: OpenSearch + Qdrant / Vespa / Weaviate if needed
 
---
 
# 13. Retrieval Strategy Recommendation
 
For legal use cases, **hybrid retrieval** is best.
 
## Recommended pipeline
1. Parse user query
2. Identify metadata constraints if possible
3. Run:
   - keyword / lexical retrieval
   - dense semantic retrieval
4. Merge candidates
5. Rerank using cross-encoder reranker
6. Pass top evidence to answer generator
7. Validate citation grounding
8. Return answer with sources
 
## Why hybrid retrieval?
Legal search depends heavily on:
- exact terms,
- act names,
- parties,
- dates,
- numbers,
- legal phrases,
- semantic similarity.
 
Dense-only retrieval misses exact terms. Keyword-only retrieval misses conceptual similarity. Hybrid is best.
 
---
 
# 14. Chunking Strategy
 
This is very important for legal RAG.
 
Your JSON contains structured fields and event-history data, so chunking should not be naive.
 
## Recommended chunk types
 
### 1. Case Summary Chunk
A normalized synthetic text built from:
- court
- parties
- year
- acts
- stage
- matched company tags
- hearing and status summary
 
### 2. Hearing History Chunks
Each hearing entry or grouped sequence by chronology.
 
### 3. Order Metadata Chunks
Each order row or grouped order sequence.
 
### 4. Status/Procedural Chunks
Case status, objections, filing/registration details.
 
### 5. Full Canonical Narrative Chunk
Constructed narrative per case for semantic retrieval.
 
## Parent-child retrieval
Store:
- parent = full case
- child = specific chunks
 
Retrieve child chunks, then map back to parent case for display.
 
This improves relevance and UI usefulness.
 
---
 
# 15. Data Processing Design
 
## 15.1 Ingestion pipeline steps
1. Load yearly JSON file
2. Validate schema
3. Normalize keys
4. Extract core metadata
5. Infer company role if possible
6. Flatten nested objects
7. Construct canonical case record
8. Build searchable text views
9. Chunk content
10. Generate embeddings
11. Write to DB and vector store
12. Build lexical indexes
13. Log ingestion statistics
 
## 15.2 Derived fields to create
- normalized_case_title
- normalized_petitioner
- normalized_respondent
- normalized_court_name
- acts_flattened
- hearing_count
- order_count
- latest_hearing_date
- latest_order_date
- company_role_inferred
- summary_text_for_embedding
- procedural_timeline_text
- legal_keywords_extracted
 
## 15.3 Data quality handling
- empty fields
- duplicate hearing/order rows
- malformed dates
- mixed casing
- inconsistent court names
- repeated party strings
- missing acts
- “View” placeholders in orders
 
---
 
# 16. Open-Source Model Recommendations
 
You asked for changeable models and local testing on Mac M4. So the system should be provider-abstracted.
 
## 16.1 Embedding Models
Recommended:
- **BAAI/bge-m3**
- **intfloat/multilingual-e5-large**
- **bge-small / bge-base** for lighter local tests
 
### My recommendation
Start with:
- **multilingual-e5-base** or **bge-small-en-v1.5** for fast local testing
Then benchmark against:
- **bge-m3** for stronger retrieval and multilingual flexibility
 
Because Hindi is optional, multilingual embeddings are useful.
 
---
 
## 16.2 Reranker
Recommended:
- **BAAI/bge-reranker-base**
- **bge-reranker-large** if hardware allows
- cross-encoder rerankers from sentence-transformers
 
Reranking is critical for legal precision.
 
---
 
## 16.3 Generator LLM
For local Mac M4 prototype:
- **Qwen2.5 7B Instruct**
- **Mistral 7B Instruct**
- **Llama 3.1 8B Instruct**
- quantized via Ollama / llama.cpp / vLLM later
 
### My recommendation
Start local with:
- **Qwen2.5 7B Instruct** or **Llama 3.1 8B Instruct**
because they are strong, general-purpose, and relatively practical locally.
 
### Future upgrade path
- larger Qwen / Llama / Mistral variants
- legal-tuned model if benchmarked better
- hosted open-weight inference on GPU in VPC
 
---
 
## 16.4 Why not fine-tune immediately?
For V1:
- retrieval quality matters more,
- prompt design + reranking + grounding reduce hallucinations better than premature fine-tuning,
- fine-tuning can come after benchmark evaluation.
 
---
 
# 17. Hallucination Minimization Strategy
 
This is the most important system behavior for legal AI.
 
## Required safeguards
 
### 1. Retrieval-grounded generation
LLM only receives retrieved evidence and structured metadata.
 
### 2. Citation-first answering
Every key claim must link to:
- case ID
- case title
- court/year
- exact evidence chunk
 
### 3. Abstention policy
If evidence score is below threshold:
- answer “Insufficient support found in available company case corpus.”
 
### 4. Structured output schema
The LLM must return:
- answer
- citations
- confidence
- assumptions
- unsupported areas
 
### 5. Reranking
Use reranker before answer generation.
 
### 6. Query decomposition
For complex questions, break query into:
- issue
- jurisdiction
- period
- company tag
- procedural stage
 
### 7. Post-generation verifier
Secondary verification step:
- check whether each answer sentence is supported by cited evidence.
This can be rule-based initially and model-assisted later.
 
### 8. Prompt constraints
Prompt should explicitly prohibit:
- inventing facts,
- citing non-retrieved cases,
- legal speculation without evidence,
- claiming certainty where not supported.
 
### 9. Evidence highlighting in UI
Show exact source excerpts alongside answer.
 
### 10. Confidence scoring
Derived from:
- retrieval score
- reranker score
- citation coverage
- verifier result
 
---
 
# 18. UI/UX Product Requirements
 
## 18.1 Design Direction
- minimalist
- professional
- elegant
- calm
- legal-tech aesthetic
- subtle glassmorphism
- restrained neumorphism
- dark/light mode
- high readability over visual excess
 
## 18.2 Frontend Stack Recommendation
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Framer Motion** for microinteractions
- **TanStack Query**
- **Zustand** or Redux Toolkit if needed
- **React Hook Form**
- **Zod**
 
## 18.3 Core Screens
 
### 1. Login / Access screen
- clean minimal auth page
 
### 2. Main Search Workspace
- central chat/search input
- suggested prompts
- advanced filters sidebar
- result panel
- AI answer panel
- source citation drawer
 
### 3. Case Explorer
- list/table/cards
- faceted filters
- sorting
- quick preview
 
### 4. Case Detail Page
- structured metadata
- hearing timeline
- orders panel
- AI summary
- related cases
- ask-on-this-case action
 
### 5. Drafting Workspace
- select task type
- choose source cases
- generate editable draft
- citation side panel
 
### 6. Comparison View
- compare 2–5 cases
- parallel metadata and passages
- supporting/opposing labels
 
### 7. Dashboard
- yearly trends
- active matters
- stage distribution
- court distribution
- recent imports
 
### 8. Admin Console
- ingestion jobs
- file upload
- model config
- prompt templates
- logs
 
---
 
## 18.4 UX Features
- natural language search bar with autocomplete
- advanced filters
- answer + sources split-screen
- copy/export citations
- expandable source evidence
- timeline visualizations
- confidence badges
- mode switch:
  - Research
  - Advisory
  - Executive
- user feedback buttons:
  - helpful
  - not grounded
  - bad citation
  - incomplete
 
---
 
# 19. Backend Service Design
 
## 19.1 Recommended Backend Stack
- **FastAPI**
- **Python 3.11+**
- **Pydantic**
- **SQLAlchemy 2.0**
- **Alembic**
- **PostgreSQL**
- **pgvector**
- **Redis** optional
- **Celery / Dramatiq** optional for background jobs
- **Poetry** or **uv** for package management
 
## 19.2 Suggested Services
1. **Auth Service**
2. **User/Role Service**
3. **Case Service**
4. **Search Service**
5. **RAG Service**
6. **Drafting Service**
7. **Ingestion Service**
8. **Indexing Service**
9. **Model Provider Service**
10. **Evaluation Service**
11. **Audit/Logging Service**
 
---
 
# 20. API Requirements
 
## Example API groups
 
### Auth
- POST /auth/login
- POST /auth/logout
- GET /auth/me
 
### Cases
- GET /cases
- GET /cases/{id}
- GET /cases/{id}/timeline
- GET /cases/{id}/related
 
### Search
- POST /search/query
- POST /search/semantic
- POST /search/hybrid
 
### AI / RAG
- POST /ai/answer
- POST /ai/summarize
- POST /ai/compare
- POST /ai/risk-score
- POST /ai/argument-map
 
### Drafting
- POST /drafts/notice
- POST /drafts/reply
- POST /drafts/brief
- POST /drafts/memo
 
### Ingestion
- POST /ingestion/upload
- POST /ingestion/run
- GET /ingestion/jobs
- POST /ingestion/reindex
 
### Admin
- GET /admin/models
- POST /admin/models/switch
- GET /admin/prompts
- PUT /admin/prompts/{id}
 
---
 
# 21. Recommended Data Schema
 
## Core tables
 
### cases
- id
- cino
- cnr_number
- state
- court_name
- bench_id
- bench_type
- judicial_branch
- district
- search_query
- search_year
- raw_petitioner
- raw_respondent
- normalized_petitioner
- normalized_respondent
- company_tags
- company_role
- filing_number
- filing_date
- registration_number
- registration_date
- first_hearing_date
- next_hearing_date
- stage_of_case
- coram
- petitioner_advocate
- respondent_advocate
- source_year_file
- raw_json
- created_at
- updated_at
 
### case_acts
- id
- case_id
- act_name
 
### hearings
- id
- case_id
- cause_list_type
- judge
- business_on_date
- hearing_date
- purpose
 
### orders
- id
- case_id
- order_number
- order_on
- judge
- order_date
- order_details_ref
 
### objections
- id
- case_id
- scrutiny_date
- objection_text
- compliance_date
- receipt_date
 
### case_chunks
- id
- case_id
- chunk_type
- chunk_text
- chunk_metadata
- embedding vector
 
### search_documents
Optional denormalized retrieval table.
 
### users
### roles
### audit_logs
### ingestion_jobs
### prompt_templates
### model_configs
 
---
 
# 22. Search and RAG Flow
 
## Query flow
1. User enters natural language query
2. Backend detects:
   - search mode,
   - drafting mode,
   - compare mode,
   - timeline mode
3. Metadata parser extracts filters if possible
4. Hybrid retrieval returns candidate chunks/cases
5. Reranker reranks evidence
6. RAG answer generator creates structured response
7. Citation validator confirms support
8. UI displays:
   - answer
   - confidence
   - case cards
   - exact passages
   - related outputs
 
---
 
# 23. Feature Set by Release
 
## V1
- login/auth
- yearly JSON ingestion
- canonical data normalization
- case explorer
- hybrid search
- citation-grounded QA
- case detail page
- hearing timeline
- AI summaries
- comparison view
- drafting: notice/reply/brief
- confidence score
- role-based access
- local deployment
 
## V1.5
- executive dashboard
- feedback loop
- better reranker
- Hindi retrieval improvement
- argument map
- supporting vs opposing precedent matrix
- export to DOCX/PDF
 
## V2
- cloud deployment
- larger models
- integration with internal systems
- active matter tracking
- alerting
- advanced analytics
- custom legal fine-tuning if needed
 
---
 
# 24. Engineering Standards
 
You asked for industry-standard design standards. These should be explicitly enforced.
 
## 24.1 Code Standards
- TypeScript strict mode on frontend
- Python type hints everywhere
- linting:
  - ESLint
  - Prettier
  - Ruff
  - Black
  - mypy/pyright where practical
- modular architecture
- dependency injection where useful
- SOLID-inspired service boundaries
- configuration via environment and typed config files
- no business logic in controllers/components
- reusable UI component system
- API schema versioning
- proper error handling and structured logs
 
## 24.2 Testing
- unit tests
- integration tests
- ingestion validation tests
- retrieval benchmark tests
- snapshot tests for prompt outputs where useful
- frontend component tests
- end-to-end tests with Playwright
 
## 24.3 DevOps
- Dockerized services
- docker-compose for local
- environment parity
- CI pipeline:
  - lint
  - test
  - build
- migration scripts
- seed scripts
- observability and health endpoints
 
## 24.4 Documentation
- README
- architecture docs
- API docs via OpenAPI
- ingestion schema docs
- runbooks for deployment and rollback
 
---
 
# 25. Security Requirements
 
## V1 Security
- JWT or secure session-based auth
- hashed passwords with bcrypt/argon2
- role-based access control
- audit logs for:
  - login
  - search
  - AI generation
  - export
  - ingestion
- secret management via env vars or secret manager later
- secure file upload validation
- encryption in transit
- local encrypted DB optional if needed
 
## Future security
- SSO / SAML
- VPC-only access
- KMS-managed encryption
- document-level access control
- IP allowlisting
- compliance logging
 
---
 
# 26. Evaluation Framework
 
## 26.1 Retrieval Metrics
- Precision@k
- Recall@k
- MRR
- nDCG
 
## 26.2 Answer Quality Metrics
- citation accuracy
- groundedness
- faithfulness
- relevance
- abstention correctness
 
## 26.3 Product Metrics
- legal team acceptance rate
- average time to relevant precedent
- reduction in manual research time
- drafting speed improvement
- user engagement by role
 
## 26.4 Human Review Set
Create a benchmark set of:
- 100–300 representative internal legal questions
- expected relevant cases
- expected citations
- acceptable answer characteristics
 
This is critical.
 
---
 
# 27. Recommended Methods and Techniques
 
You asked for methods suggestions. Here is the recommended set.
 
## 27.1 Retrieval methods
Use:
- **hybrid retrieval**
- metadata filtering
- query decomposition
- reranking
- parent-child chunk retrieval
 
Avoid relying on:
- pure dense retrieval only
 
## 27.2 Hallucination reduction methods
Use:
- grounded generation
- exact evidence display
- answer abstention
- post-answer verification
- confidence scoring
- citation requirement
- structured prompt templates by mode
 
## 27.3 Data storage methods
Use:
- PostgreSQL + pgvector for V1
- denormalized retrieval documents
- normalized legal metadata tables
 
## 27.4 Drafting methods
Use:
- evidence-first synthesis
- template-assisted generation
- editable outputs
- citation sidecar
 
## 27.5 Explainability methods
Use:
- “why this case matched”
- highlighted evidence spans
- comparison tables
- supporting/opposing labeling
- confidence bands
 
---
 
# 28. Suggested Prompting Strategy
 
## Research mode prompt behavior
- answer only from provided sources
- cite every key statement
- if support missing, say insufficient evidence
- no invented sections/facts/outcomes
 
## Advisory mode prompt behavior
- produce possible recommendations grounded in evidence
- label them as AI-assisted
- cite precedent support and caveats
 
## Drafting mode prompt behavior
- generate formal legal draft structure
- mark placeholders for missing facts
- list supporting cases separately
 
---
 
# 29. Local Prototype Deployment Recommendation
 
## For MacBook M4
### Suggested local stack
- Next.js frontend
- FastAPI backend
- PostgreSQL + pgvector via Docker
- Ollama for local LLM serving
- embedding service using sentence-transformers
- optional reranker running locally
- Docker Compose orchestration
 
### Why this works
- manageable operational complexity
- easy to swap models
- supports local experimentation
- ready to move to AWS later
 
---
 
# 30. Future Cloud Deployment Recommendation
 
When moving to AWS/VPC:
- ECS/EKS for app services
- RDS PostgreSQL + pgvector
- ElastiCache Redis
- S3 for raw JSON and artifacts
- ALB + WAF
- GPU-backed inference endpoint or self-hosted vLLM
- CloudWatch/Grafana/Loki for monitoring
 
---
 
# 31. Risks and Mitigations
 
## Risk 1: JSON inconsistency
Mitigation:
- robust schema normalization
- ingestion validation
- raw JSON retention
 
## Risk 2: weak retrieval quality
Mitigation:
- hybrid retrieval
- reranker
- benchmark set
- chunk optimization
 
## Risk 3: hallucination
Mitigation:
- citation-first answering
- abstention
- verifier
- strict prompts
 
## Risk 4: local hardware limitations
Mitigation:
- quantized 7B/8B model
- lighter embeddings
- model abstraction layer
 
## Risk 5: legal misuse
Mitigation:
- role-based controls
- “AI-assisted” labeling
- confidence score
- evidence display
- optional legal-review workflow later
 
---
 
# 32. Suggested Technical Stack Summary
 
## Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- TanStack Query
- Zustand
 
## Backend
- FastAPI
- Python
- Pydantic
- SQLAlchemy
- Alembic
 
## DB / Search
- PostgreSQL
- pgvector
- PostgreSQL full-text search initially
 
## AI stack
- Ollama / llama.cpp local inference
- Qwen2.5 7B / Llama 3.1 8B
- multilingual-e5 or bge embeddings
- bge reranker
 
## Infra
- Docker
- Docker Compose
- GitHub Actions
 
---
 
# 33. Acceptance Criteria for V1
 
The system is accepted when:
 
1. User can upload/import yearly JSON files.
2. System correctly normalizes and stores case data.
3. User can search via natural language and filters.
4. Search results show relevant case details with excerpts.
5. User can open a case detail page with full metadata and timeline.
6. User can ask legal questions and receive citation-grounded answers.
7. User can generate at least:
   - notice draft,
   - reply draft,
   - case brief.
8. Outputs include confidence score and supporting sources.
9. Admin can switch model configuration without major code changes.
10. App runs locally on MacBook M4.
11. Role-based access works.
12. Core retrieval and answer quality meet benchmark thresholds.
 
---
 
# 34. Suggested Folder / Service Architecture
 
## Monorepo recommended
 
```bash
/legal-ai-rag
  /apps
    /web              # Next.js frontend
    /api              # FastAPI backend
    /worker           # background ingestion/indexing jobs
  /packages
    /ui               # shared UI components
    /config           # shared config/types
    /prompts          # prompt templates
    /schemas          # shared API/data schemas
  /infra
    /docker
    /scripts
  /docs
```
 
## Backend internal structure
```bash
/api
  /app
    /api
    /core
    /models
    /schemas
    /services
    /repositories
    /rag
    /ingestion
    /search
    /drafting
    /auth
    /db
    /tests
```
 
This is the right level of maintainability for production-style development.
 
---
 
# 35. Additional Features I Recommend Adding
 
Since you said “add other features as needed,” these are high-value additions:
 
## Recommended additions
1. **Saved searches**
2. **Pinned cases**
3. **Search history**
4. **Source citation export**
5. **User feedback loop on answer quality**
6. **Matter watchlist**
7. **Case cluster by issue/topic**
8. **Plain-English explanation mode**
9. **AI-generated case brief one-click**
10. **Prompt templates by legal task**
11. **Audit trail for generated drafts**
12. **“Why matched?” retrieval explanation**
 
---
 
# 36. Final Recommendation Summary
 
If I were building this for you, I would choose:
 
## Best overall architecture for V1
- **Frontend:** Next.js + TypeScript + Tailwind + shadcn/ui
- **Backend:** FastAPI + Python
- **Database:** PostgreSQL + pgvector
- **Retrieval:** hybrid search with metadata filters + reranker
- **LLM:** free APIs from Groq or other platforms like openrouter (suggest those to me)
- **Embeddings:** multilingual-e5 or bge-m3
- **Reranker:** bge-reranker-base
- **Deployment initially:** Docker Compose on Mac M4
- **Design:** minimalist legal-tech interface with subtle glassmorphism/neumorphism
- **Key differentiator:** strict citation-grounded legal RAG with case detail visibility in UI
 
---
 
# 37. Open Questions Before Build
 
These are the remaining things I’d want confirmed before turning this into an implementation plan:
 
1. Do your scraped JSON files include full order/judgment text anywhere, or only metadata?
   - This is extremely important for answer depth and draft quality.
   answer : not sure about it i will keep a folder with JSONs with all the data in seperate files for each year check it
 
2. Are the “View” values in orders placeholders for downloadable documents you also possess?
   - If yes, we should ingest those texts too.
   answer : NO
 
3. Do you want authentication in V1 or can prototype be single-user first?
   - I still recommend auth from the start.
   answer : NO , but in the future it will be needed.
 

---
 

 
### Option A — Technical Architecture Document
A deeper engineering architecture with services, DB schema, APIs, deployment, and sequence diagrams.
 
 
### Option C — Detailed Database Schema
Production-grade SQL schema and indexing strategy.
 
### Option D — Folder structure + coding standards document
A practical engineering handbook for this project.
 
### Option E — Full UI/UX spec
Screen-by-screen product design spec with components and user flow.
 
### Option F — Build plan with exact models/tools
A concrete “use this stack, these libraries, these model choices” implementation guide.

 