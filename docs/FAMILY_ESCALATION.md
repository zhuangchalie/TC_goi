# Family escalation policy

Default:
- 0-69: no family alert
- 70-84: senior warning + local notification
- 85-94: senior warning + one SMS to primary caregiver
- 95-100: senior warning + primary + secondary caregiver SMS

Every family alert contains:
- risk score
- time
- caller number if available
- 2-3 reasons
- recommended action

Never include raw audio by default.

Anti-spam:
- same caller + same risk class: at most one family SMS per 30 minutes
- cooldown is persisted locally
- caregiver can disable escalation
