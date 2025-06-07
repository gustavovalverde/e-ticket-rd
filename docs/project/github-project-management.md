# GitHub Project Management System

This document explains how we manage the Dominican Republic E-Ticket System project. Our system supports different development stages and welcomes various types of contributors in our open-source community.

## Overview

We use **themes instead of sprints** to organize our work. This lets us work on different parts of the system at the same time. Our setup handles research, design, coding, and improvements through automated workflows that help sort and organize tasks.

## Project Philosophy

### Open Source Collaboration

- **Everything is public**: You can see all issues and our progress
- **Everyone can contribute**: Researchers, designers, developers, testers, and subject matter experts
- **Clear process**: Easy-to-follow stages that show what's happening and who's responsible
- **Room for everyone**: Different ways to get involved based on your skills and time

### Theme-Based Organization

We group our work by **themes** - the main areas of our system:

- **🏗️ Foundation**: Core architecture, security, infrastructure
- **✨ Core Experience**: Essential user flows and functionality
- **🚀 Enhanced UX**: Advanced features, optimizations, polish
- **🔒 Security & Compliance**: Security measures, regulatory compliance
- **🌐 Accessibility & i18n**: Internationalization, accessibility features
- **📊 Analytics & Insights**: Data collection, reporting, analytics
- **🔧 Developer Experience**: Tools, documentation, testing infrastructure

## Workflow Stages

Every task moves through **7 stages**:

### 🔍 Triage

- **What happens**: We review and sort new issues
- **How long**: 1-3 days
- **What we do**:
  - Automation adds labels and fills in fields
  - Community discusses and asks questions
  - We figure out priority and complexity
  - We assign it to a theme

### 🔍 Research

- **What happens**: We investigate and learn
- **How long**: 1-2 weeks
- **What we do**:
  - Check if ideas are technically possible
  - Research what users need
  - Write decision documents (ADRs)
  - Build small test versions
- **What you get**: Decision records, research docs, technical specs

### 📋 Planning

- **What happens**: Approved work waiting to be designed or built
- **How long**: Varies (it's our backlog)
- **What we do**:
  - Polish the requirements
  - Review technical details
  - Plan who works on what
  - Figure out what depends on what

### 🎨 Design

- **What happens**: UI/UX design and user experience work
- **How long**: 1-2 weeks
- **What we do**:
  - Design user interfaces
  - Map out user journeys
  - Make sure it's accessible to everyone
  - Update our design system
- **What you get**: Figma designs, user flows, design specs

### ⚙️ Implementation

- **What happens**: We build the actual feature
- **How long**: 1-4 weeks (depends on how complex it is)
- **What we do**:
  - Write code
  - Test individual pieces
  - Connect everything together
  - Write basic documentation

### 🧪 Validation

- **What happens**: Quality checks and review
- **How long**: 3-7 days
- **What we do**:
  - Review the pull request
  - Run automated tests
  - Check code quality
  - Deploy to staging
  - Test everything works
  - Security review

### ✅ Done

- **What happens**: Work is finished and live
- **What we do**:
  - Deploy to production
  - Update documentation
  - Write release notes
  - Tell everyone it's ready

## Custom Fields

### Priority Levels

- **🔥 Critical**: Security issues, production bugs, blockers
- **⚡ High**: Important features, significant bugs
- **📋 Medium**: Standard features, minor bugs
- **📝 Low**: Nice-to-have features, documentation, cleanup

### Complexity/Size

- **XS**: 1-2 hours (documentation, simple fixes)
- **S**: 2-8 hours (small features, bug fixes)
- **M**: 1-3 days (medium features, refactoring)
- **L**: 3-7 days (large features, major changes)
- **XL**: 1-2 weeks (epic features, architectural changes)
- **Unknown**: Requires investigation to determine size

### Theme Assignment

Items are categorized by their primary focus area (see Theme-Based Organization above).

## Label System

### Stage Labels (Automated)

- `stage:triage` - Items in triage phase
- `stage:research` - Items requiring investigation
- `stage:planning` - Items ready for planning
- `stage:design` - Items in design phase
- `stage:implementation` - Items being developed
- `stage:validation` - Items under review/testing

### Priority Labels (Automated)

- `priority:critical` - Critical priority items
- `priority:high` - High priority items
- `priority:medium` - Medium priority items
- `priority:low` - Low priority items

### Type Labels

- `bug` - Software defects
- `enhancement` - New features or improvements
- `documentation` - Documentation updates
- `security` - Security-related issues
- `performance` - Performance improvements
- `accessibility` - Accessibility improvements
- `research` - Research and investigation tasks

### Theme Labels (Automated)

- `theme:foundation` - Core architecture work
- `theme:core-experience` - Essential user flows
- `theme:enhanced-ux` - Advanced UX features
- `theme:security` - Security and compliance
- `theme:accessibility` - Accessibility and i18n
- `theme:analytics` - Analytics and insights
- `theme:dx` - Developer experience

### Complexity Labels (Automated)

- `size:xs`, `size:s`, `size:m`, `size:l`, `size:xl`, `size:unknown`

### Special Labels

- `good first issue` - Suitable for new contributors
- `help wanted` - Community assistance needed
- `needs:design` - Requires design work
- `needs:research` - Requires investigation
- `blocked` - Cannot proceed due to dependencies

## Project Views

### 1. 📋 Kanban Board (Default)

- **Purpose**: Visual workflow management
- **Columns**: All 7 stages
- **Filters**: None (shows all items)
- **Usage**: Daily standups, progress tracking

### 2. 🎯 Theme Roadmap

- **Purpose**: Strategic planning by theme
- **Group by**: Theme field
- **Sort by**: Priority, then complexity
- **Usage**: Feature planning, resource allocation

### 3. 🐛 Bug Triage

- **Purpose**: Bug management and triage
- **Filter**: `type:bug`
- **Sort by**: Priority, then date created
- **Usage**: Bug bash sessions, support team

### 4. 🔒 Security Issues

- **Purpose**: Security-focused issue management
- **Filter**: `label:security OR priority:critical`
- **Sort by**: Priority, then date created
- **Usage**: Security team, incident response

### 5. 👥 Community Contributions

- **Purpose**: Issues suitable for community contributors
- **Filter**: `label:"good first issue" OR label:"help wanted"`
- **Sort by**: Complexity, then theme
- **Usage**: Onboarding new contributors

### 6. 📊 Priority Dashboard

- **Purpose**: Priority-based work planning
- **Group by**: Priority field
- **Sort by**: Date created
- **Usage**: Sprint planning, resource prioritization

## Automation Workflows

### Built-in GitHub Project Automations

1. **Auto-add to Project**

   - **Trigger**: New issues or PRs in e-ticket-rd repository
   - **Filter**: `is:issue,pr is:open`
   - **Action**: Adds item to project

2. **Item Added to Project**

   - **Trigger**: Item added to project
   - **Action**: Sets Status to "🔍 Triage"

3. **Item Reopened**

   - **Trigger**: Closed item reopened
   - **Action**: Sets Status to "🔍 Triage"

4. **Item Closed**

   - **Trigger**: Issue or PR closed
   - **Action**: Sets Status to "✅ Done"

5. **Pull Request Merged**

   - **Trigger**: PR merged
   - **Action**: Sets Status to "✅ Done"

6. **Code Changes Requested**

   - **Trigger**: PR review requests changes
   - **Action**: Sets Status to "⚙️ Implementation"

7. **Code Review Approved**

   - **Trigger**: PR review approved
   - **Action**: Sets Status to "🧪 Validation"

8. **Auto-archive Items**
   - **Trigger**: Items closed for 2+ weeks
   - **Action**: Archives item

### GitHub Actions Automations

#### Project Automation Workflow

**File**: `.github/workflows/project-automation.yml`

**What it does**:

- **Smart sorting**: Reads issues and assigns priority, theme, and complexity
- **Security alerts**: Special handling for urgent security problems
- **Decision tracking**: Links research tasks to decision records
- **PR analysis**: Automatically labels PR size and runs quality checks
- **Smart categorization**: Automatically sorts issues and PRs

**Triggers**:

- Issue opened/edited
- PR opened/edited/ready for review
- Issue/PR labeled
- PR review submitted

#### Stale Issue Management

**File**: `.github/workflows/stale-issue-management.yml`

**Purpose**: Automated cleanup of inactive issues
**Schedule**: Weekly on Sundays
**Actions**:

- Marks stale issues after 60 days of inactivity
- Closes stale issues after 14 additional days
- Exempts issues with specific labels (security, enhancement, etc.)

## Contributor Guidelines

### For New Contributors

1. **Find Issues**: Use "Community Contributions" view
2. **Start Small**: Look for `good first issue` labels
3. **Ask Questions**: Comment on issues for clarification
4. **Follow Process**: Issues will automatically move through stages

### For Maintainers

1. **Monitor Triage**: Review new items daily
2. **Validate Automation**: Ensure fields are correctly assigned
3. **Guide Discussion**: Facilitate research and planning phases
4. **Review Progress**: Use views to track theme progress

### For Project Managers

1. **Strategic Planning**: Use Theme Roadmap view
2. **Resource Allocation**: Monitor Priority Dashboard
3. **Issue Grooming**: Regularly review and refine backlog
4. **Community Engagement**: Respond to community contributions

## Best Practices

### Creating Issues

- Use the templates in `.github/ISSUE_TEMPLATE/`
- Write clear descriptions and what "done" looks like
- Tag the right people
- Add labels to help with sorting

### Managing Pull Requests

- Link to the related issues
- Explain what you changed and why
- Include notes about testing
- Ask the right people to review

### Project Maintenance

- Regular backlog grooming (weekly)
- Theme-based planning sessions (bi-weekly)
- Community contribution review (weekly)
- Performance metrics review (monthly)

## Metrics and KPIs

### Velocity Metrics

- Issues completed per theme per month
- Average time in each stage
- Community contribution rate

### Quality Metrics

- Bug escape rate
- Security issue response time
- Code review turnaround time

### Community Metrics

- New contributor onboarding rate
- Community issue resolution rate
- Documentation update frequency

## Getting Started

### If you're managing the project

1. Read through this document
2. Get familiar with the different project views
3. Learn how the automation works
4. Join our communication channels

### If you want to contribute

1. Check out the "Community Contributions" view
2. Read our contributing guidelines
3. Start with issues marked `good first issue`
4. Jump into discussions and ask questions

### If you're maintaining the project

1. Keep an eye on how automation is working
2. Adjust field assignments when needed
3. Help teams work together across themes
4. Keep documentation up to date

## Troubleshooting

### Common Issues

- **Items stuck in Triage**: May need manual field assignment
- **Automation not working**: Check GitHub Actions logs
- **Missing labels**: Automation may need adjustment
- **Incorrect field values**: Manual override may be needed

### Support Channels

- GitHub Discussions for questions
- Issue comments for specific item questions
- Project README for general information

## Making Things Better

Our project management setup will change as we learn what works and what doesn't. We regularly check and adjust things to keep everything running smoothly.

### When we review things

- **Every week**: How well automation is working
- **Every two weeks**: Whether fields and labels are right
- **Every month**: How smooth our workflow is
- **Every few months**: How the whole system is doing
