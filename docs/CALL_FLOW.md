# Call AI flow

1. User gives permission and selects a recording file.
2. GuardianAI uploads the file to the user's configured AI server.
3. OpenVINO Whisper converts speech to Vietnamese transcript.
4. Scam engine analyzes social-engineering signals.
5. GuardianAI returns score + reasons + transcript.
6. If score >= 70 and a family contact is configured, the app sends an SMS alert.
7. The user can review the transcript and delete the source recording.

The competition demo should use a consented sample recording, not a secretly
captured phone call.
