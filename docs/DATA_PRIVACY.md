# 🔒 Data Privacy & Security Compliance

## Overview

The Neurodivergent Productivity App is designed with privacy-first principles, implementing comprehensive security measures and compliance with international data protection regulations including GDPR, CCPA, and accessibility standards.

## Privacy Principles

### 1. Data Minimization
We collect only the minimal data necessary for app functionality:
- **Brain State Data**: Energy, focus, mood levels (1-10 scale)
- **Task Information**: Title, complexity, completion status
- **Usage Analytics**: AI request counts for freemium management
- **NO Collection of**: Detailed personal information, health records, or sensitive identifiers

### 2. Purpose Limitation
Data is used solely for intended app functionality:
- **Brain States** → UI adaptation and task filtering
- **Tasks** → Personal productivity management
- **AI Requests** → Service quota management
- **NO Secondary Uses**: No advertising, profiling, or data sales

### 3. User Control
Users maintain complete control over their data:
- **View All Data**: Export functionality via API
- **Delete Account**: Complete data removal with CASCADE DELETE
- **Modify Data**: Edit or remove individual entries
- **Granular Control**: Choose what data to share

## GDPR Compliance

### Legal Basis for Processing
- **Article 6(1)(b)**: Contract performance (app functionality)
- **Article 6(1)(f)**: Legitimate interests (service improvement)
- **Article 9**: Special category data protections (brain state as health-related)

### Data Subject Rights Implementation

#### Right to Access (Article 15)
```javascript
// API endpoint for data export
GET /api/user/data-export
Response: {
  "brain_states": [...],
  "tasks": [...],
  "subscription": {...},
  "export_date": "2025-06-25T10:00:00Z"
}
```

#### Right to Rectification (Article 16)
Users can modify all personal data through the app interface:
- Edit brain state entries
- Update task information
- Modify account settings

#### Right to Erasure (Article 17)
```sql
-- Complete data deletion (triggered by account deletion)
DELETE FROM tasks WHERE user_id = $user_id;
DELETE FROM brain_states WHERE user_id = $user_id;
DELETE FROM user_subscriptions WHERE user_id = $user_id;
-- User record removed from auth.users by Supabase
```

#### Right to Portability (Article 20)
Data export includes all user data in machine-readable JSON format compatible with other productivity apps.

#### Right to Object (Article 21)
Users can object to processing by deleting their account or specific data types.

### GDPR Technical Measures

#### Privacy by Design
- **Default Privacy**: Minimal data collection enabled by default
- **RLS Implementation**: Database-level access controls
- **Encryption**: Data encrypted at rest and in transit
- **Anonymization**: No cross-user data access possible

#### Data Protection Impact Assessment (DPIA)
**Risk Level**: Low to Medium
- Brain state data could be considered health-related
- Mitigation: Aggregated only, no medical diagnoses
- Purpose: UI adaptation, not health monitoring

## CCPA Compliance

### Consumer Rights Implementation

#### Right to Know
- Privacy policy clearly states data collection practices
- In-app transparency about data usage
- Regular privacy policy updates

#### Right to Delete
- Account deletion removes all personal information
- 30-day retention for backup integrity, then permanent deletion
- No retention for marketing purposes

#### Right to Opt-Out
- No sale of personal information (we don't sell data)
- Opt-out of usage analytics (planned feature)
- Granular privacy controls

#### Non-Discrimination
- Core app features remain available regardless of privacy choices
- Premium features not affected by privacy settings
- Equal service quality for all users

## Technical Security Measures

### Database Security

#### Row Level Security (RLS)
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own brain states" ON brain_states
  FOR SELECT USING (auth.uid() = user_id);
```

#### Encryption
- **At Rest**: Supabase provides AES-256 encryption
- **In Transit**: TLS 1.3 for all API communications
- **Client Storage**: Expo SecureStore for sensitive tokens

#### Access Controls
- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: RLS policies enforce data isolation
- **API Keys**: Environment-based, never hardcoded
- **Session Management**: Automatic token refresh and expiry

### Application Security

#### Input Validation
```typescript
// Brain state validation
const validateBrainState = (data: BrainStateInput): boolean => {
  return (
    data.energy_level >= 1 && data.energy_level <= 10 &&
    data.focus_level >= 1 && data.focus_level <= 10 &&
    data.mood_level >= 1 && data.mood_level <= 10 &&
    (!data.notes || data.notes.length <= 500)
  );
};
```

#### API Security
- **Rate Limiting**: Prevent abuse and DDoS
- **CORS**: Restricted to app domains
- **SSL Pinning**: Prevent man-in-the-middle attacks
- **Request Signing**: Verify request integrity

#### Client-Side Security
- **No Sensitive Data Storage**: Only non-sensitive data cached locally
- **Secure Token Storage**: Expo SecureStore for authentication tokens
- **Code Obfuscation**: Production builds use code minification
- **Certificate Pinning**: Verify server identity

## Data Retention & Deletion

### Retention Periods

#### Active User Data
- **Brain States**: Retained indefinitely while account active
- **Tasks**: Retained until user deletion
- **Subscription Info**: Retained for billing/legal requirements

#### Deleted Account Data
- **Immediate**: Remove from production database
- **30 Days**: Backup retention for recovery purposes
- **Permanent**: Complete removal from all systems

#### Legal Holds
- **Compliance**: May retain data longer if legally required
- **Notification**: Users informed of any legal hold requirements
- **Limitation**: Only data necessary for compliance retained

### Automated Deletion
```sql
-- Automated cleanup of expired data (example)
CREATE OR REPLACE FUNCTION cleanup_deleted_users()
RETURNS void AS $$
BEGIN
  -- Remove data from users deleted >30 days ago
  DELETE FROM brain_states 
  WHERE user_id NOT IN (SELECT id FROM auth.users)
    AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
```

## Incident Response Plan

### Data Breach Response

#### Detection (0-1 hour)
1. **Automated Monitoring**: Database access anomalies
2. **Manual Discovery**: Team member identifies issue
3. **User Reports**: Users report suspicious activity

#### Assessment (1-4 hours)
1. **Scope Determination**: Which data affected
2. **Impact Analysis**: Number of users impacted
3. **Risk Assessment**: Severity of potential harm

#### Containment (4-8 hours)
1. **Immediate Actions**: Stop the breach
2. **Preserve Evidence**: Log files and forensic data
3. **Secure Systems**: Patch vulnerabilities

#### Notification (8-72 hours)
1. **Regulatory**: GDPR requires 72-hour notification
2. **User Notification**: Affected users contacted
3. **Public Disclosure**: If legally required

### Security Incident Categories

#### Category 1: System Access
- Unauthorized database access
- Compromised admin accounts
- RLS policy bypassed

#### Category 2: Data Exposure
- Brain state data leaked
- Task information compromised
- User identification exposed

#### Category 3: Service Disruption
- Database unavailable
- Authentication system compromised
- App functionality impaired

## Compliance Monitoring

### Regular Audits

#### Monthly Reviews
- [ ] RLS policy effectiveness
- [ ] Access log analysis
- [ ] Data retention compliance
- [ ] User privacy settings

#### Quarterly Assessments
- [ ] Privacy policy updates needed
- [ ] Security vulnerability scan
- [ ] Compliance requirements review
- [ ] Staff training updates

#### Annual Evaluations
- [ ] Full security audit
- [ ] GDPR compliance assessment
- [ ] Privacy impact assessment update
- [ ] Incident response plan testing

### Compliance Metrics

#### Privacy Metrics
- Data subject request response time (target: <30 days)
- Data deletion completion rate (target: 100%)
- Privacy policy acceptance rate
- User data export requests

#### Security Metrics
- Authentication failure rate
- Database access anomalies
- SSL certificate validity
- Backup integrity verification

## User Communications

### Privacy Policy Highlights
- Simple, jargon-free language
- Specific to neurodivergent users
- Regular updates with user notification
- Available in-app and on website

### Consent Management
- Clear opt-in for all data processing
- Granular consent options
- Easy withdrawal process
- Consent renewal reminders

### Transparency Reports
- Annual transparency report
- Data request statistics
- Security incident summaries (anonymized)
- Compliance certification status

## International Considerations

### Cross-Border Data Transfers
- **Primary Storage**: EU/US regions with adequacy decisions
- **Backup Storage**: Encrypted, same jurisdiction
- **Processing**: Supabase handles compliance automatically

### Regional Requirements
- **EU**: GDPR compliance mandatory
- **California**: CCPA compliance for CA residents
- **UK**: UK GDPR post-Brexit requirements
- **Canada**: PIPEDA considerations for Canadian users

## Contact Information

### Data Protection Officer
- **Role**: Privacy compliance oversight
- **Contact**: privacy@neuroapp.com
- **Response Time**: 48 hours maximum

### User Rights Requests
- **Email**: data-requests@neuroapp.com
- **Portal**: In-app privacy settings
- **Response Time**: 30 days maximum (GDPR requirement)

### Security Concerns
- **Email**: security@neuroapp.com
- **Emergency**: security-emergency@neuroapp.com
- **Response Time**: 24 hours for critical issues

---

**Privacy-first design for neurodivergent users with comprehensive compliance** 🔒