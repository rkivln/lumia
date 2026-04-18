# Security Specification - Lumina Freelance Portal

## 1. Data Invariants
- A `Proposal` cannot exist without a valid `Job`.
- A `Message` cannot exist without a valid `ChatRoom`.
- A user can only be a `client` or `freelancer`.
- `clientId` on a Job must match the creator's UID.
- `freelancerId` on a Proposal must match the creator's UID.
- Only participants of a `ChatRoom` can read or write messages to it.

## 2. The "Dirty Dozen" Payloads (Test Cases)

1. **Identity Spoofing**: Attempting to create a profile for another user's UID.
2. **Role Escalation**: Attempting to update one's own role to 'admin' (even though omitted from UI).
3. **Malicious Proposal**: Proposing to a job with a negative bid amount.
4. **Shadow Proposal**: Creating a proposal but setting the `freelancerId` to another user.
5. **Job Hijack**: Updating a job's `clientId` to take ownership.
6. **Chat Snooping**: Reading messages in a ChatRoom where the user is not a participant.
7. **Phantom Message**: Sending a message as another user.
8. **Resource Exhaustion**: Sending a 1MB string as a cover letter.
9. **Status Shortcut**: A freelancer setting a job status to 'completed' without client approval.
10. **ID Poisoning**: Using a 2KB string as a `jobId`.
11. **Unverified Write**: Creating a profile without clear email verification (if mandated).
12. **orphaned Write**: Creating a proposal for a job that doesn't exist.

## 3. Implementation Plan
- Deploy `firestore.rules` with strict `isValid` checks.
- Use `get()` to verify job ownership for proposal management.
- Use `get()` to verify ChatRoom membership for messaging.
