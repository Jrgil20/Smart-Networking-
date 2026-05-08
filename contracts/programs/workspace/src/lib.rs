use anchor_lang::prelude::*;

declare_id!("9yEGhSnNtkW6i6NxmXRniN2BNr6a8AvUxDf69h7DNSCm");

#[program]
pub mod workspace {
    use super::*;

    // interests_hash: [u8; 32], Hash of user interests, [0u8; 32]
    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        interests_hash: [u8; 32],
    ) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        profile.user = ctx.accounts.user.key();
        profile.reputation_score = 50;
        profile.badges_count = 0;
        profile.total_check_ins = 0;
        profile.total_matches = 0;
        profile.total_reviews_given = 0;
        profile.total_reviews_received = 0;
        profile.interests_hash = interests_hash;
        profile.last_updated = Clock::get()?.unix_timestamp;
        profile.bump = ctx.bumps.profile;
        Ok(())
    }

    // event_id: String, Unique event identifier, "event_001"
    // name: String, Event display name, "Solana Hacker House"
    // max_attendees: u32, Maximum number of attendees, 100
    pub fn create_event(
        ctx: Context<CreateEvent>,
        event_id: String,
        name: String,
        max_attendees: u32,
    ) -> Result<()> {
        require!(event_id.len() <= 64, ErrorCode::InvalidParameter);
        require!(name.len() <= 128, ErrorCode::InvalidParameter);
        require!(max_attendees > 0, ErrorCode::InvalidParameter);

        let event = &mut ctx.accounts.event_config;
        event.organizer = ctx.accounts.organizer.key();
        event.event_id = event_id;
        event.name = name;
        event.max_attendees = max_attendees;
        event.current_attendees = 0;
        event.is_active = true;
        event.created_at = Clock::get()?.unix_timestamp;
        event.bump = ctx.bumps.event_config;
        Ok(())
    }

    // event_id: String, Event to check into, "event_001"
    pub fn check_in(
        ctx: Context<CheckIn>,
        event_id: String,
    ) -> Result<()> {
        let event = &ctx.accounts.event_config;
        require!(event.is_active, ErrorCode::EventNotActive);
        require!(event.current_attendees < event.max_attendees, ErrorCode::EventFull);

        let attendance = &mut ctx.accounts.attendance;
        attendance.user = ctx.accounts.user.key();
        attendance.event_id = event_id;
        attendance.checked_in = true;
        attendance.timestamp = Clock::get()?.unix_timestamp;
        attendance.bump = ctx.bumps.attendance;

        let event = &mut ctx.accounts.event_config;
        event.current_attendees = event.current_attendees.checked_add(1).ok_or(ErrorCode::MathOverflow)?;

        let profile = &mut ctx.accounts.profile;
        profile.total_check_ins = profile.total_check_ins.checked_add(1).ok_or(ErrorCode::MathOverflow)?;
        profile.badges_count = profile.badges_count.checked_add(1).ok_or(ErrorCode::MathOverflow)?;
        profile.last_updated = Clock::get()?.unix_timestamp;

        Ok(())
    }

    // event_id: String, Event where review takes place, "event_001"
    // rating: u8, Rating from 1 to 5, 4
    // comment_hash: [u8; 32], Hash of review comment, [0u8; 32]
    pub fn submit_review(
        ctx: Context<SubmitReview>,
        event_id: String,
        rating: u8,
        comment_hash: [u8; 32],
    ) -> Result<()> {
        require!(rating >= 1 && rating <= 5, ErrorCode::InvalidRating);
        require!(ctx.accounts.reviewer_attendance.checked_in, ErrorCode::NotCheckedIn);
        require!(ctx.accounts.reviewed_attendance.checked_in, ErrorCode::NotCheckedIn);

        let review = &mut ctx.accounts.review;
        review.reviewer = ctx.accounts.reviewer.key();
        review.reviewed_user = ctx.accounts.reviewed_user.key();
        review.event_id = event_id;
        review.rating = rating;
        review.comment_hash = comment_hash;
        review.timestamp = Clock::get()?.unix_timestamp;
        review.bump = ctx.bumps.review;

        let reviewer_profile = &mut ctx.accounts.reviewer_profile;
        reviewer_profile.total_reviews_given = reviewer_profile.total_reviews_given.checked_add(1).ok_or(ErrorCode::MathOverflow)?;
        reviewer_profile.last_updated = Clock::get()?.unix_timestamp;

        let reviewed_profile = &mut ctx.accounts.reviewed_profile;
        reviewed_profile.total_reviews_received = reviewed_profile.total_reviews_received.checked_add(1).ok_or(ErrorCode::MathOverflow)?;

        if rating >= 4 {
            reviewed_profile.reputation_score = reviewed_profile.reputation_score.saturating_add(2).min(100);
        } else if rating <= 2 {
            reviewed_profile.reputation_score = reviewed_profile.reputation_score.saturating_sub(1);
        }
        reviewed_profile.last_updated = Clock::get()?.unix_timestamp;

        Ok(())
    }

    // event_id: String, Event context for admin override, "event_001"
    // new_score: u16, New reputation score 0-100, 75
    pub fn update_reputation(
        ctx: Context<UpdateReputation>,
        _event_id: String,
        new_score: u16,
    ) -> Result<()> {
        require!(new_score <= 100, ErrorCode::InvalidReputationScore);
        require!(
            ctx.accounts.event_config.organizer == ctx.accounts.authority.key(),
            ErrorCode::Unauthorized
        );

        let profile = &mut ctx.accounts.profile;
        profile.reputation_score = new_score;
        profile.last_updated = Clock::get()?.unix_timestamp;

        Ok(())
    }
}

// ── Context Structs ──

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(
        init,
        seeds = [b"profile", user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + UserProfile::LEN,
    )]
    pub profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(event_id: String)]
pub struct CreateEvent<'info> {
    #[account(
        init,
        seeds = [b"event", event_id.as_bytes()],
        bump,
        payer = organizer,
        space = 8 + EventConfig::LEN,
    )]
    pub event_config: Account<'info, EventConfig>,
    #[account(mut)]
    pub organizer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(event_id: String)]
pub struct CheckIn<'info> {
    #[account(
        mut,
        seeds = [b"event", event_id.as_bytes()],
        bump = event_config.bump,
    )]
    pub event_config: Account<'info, EventConfig>,
    #[account(
        init,
        seeds = [b"attendance", event_id.as_bytes(), user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + Attendance::LEN,
    )]
    pub attendance: Account<'info, Attendance>,
    #[account(
        mut,
        seeds = [b"profile", user.key().as_ref()],
        bump = profile.bump,
    )]
    pub profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(event_id: String)]
pub struct SubmitReview<'info> {
    #[account(
        init,
        seeds = [b"review", event_id.as_bytes(), reviewer.key().as_ref(), reviewed_user.key().as_ref()],
        bump,
        payer = reviewer,
        space = 8 + UserReview::LEN,
    )]
    pub review: Account<'info, UserReview>,
    #[account(
        seeds = [b"attendance", event_id.as_bytes(), reviewer.key().as_ref()],
        bump = reviewer_attendance.bump,
    )]
    pub reviewer_attendance: Account<'info, Attendance>,
    #[account(
        seeds = [b"attendance", event_id.as_bytes(), reviewed_user.key().as_ref()],
        bump = reviewed_attendance.bump,
    )]
    pub reviewed_attendance: Account<'info, Attendance>,
    #[account(
        mut,
        seeds = [b"profile", reviewer.key().as_ref()],
        bump = reviewer_profile.bump,
    )]
    pub reviewer_profile: Account<'info, UserProfile>,
    #[account(
        mut,
        seeds = [b"profile", reviewed_user.key().as_ref()],
        bump = reviewed_profile.bump,
    )]
    pub reviewed_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub reviewer: Signer<'info>,
    /// CHECK: Verified via reviewed_attendance PDA seeds
    pub reviewed_user: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

// STACK OVERFLOW CHECK:
// ACCOUNTS: 1. review, 2. reviewer_attendance, 3. reviewed_attendance, 4. reviewer_profile, 5. reviewed_profile, 6. reviewer, 7. reviewed_user, 8. system_program
// TOTAL ACCOUNTS: 8 (✅ PASS ≤8)
// CPI CALLS: 0 (✅ PASS ≤3)

#[derive(Accounts)]
#[instruction(event_id: String)]
pub struct UpdateReputation<'info> {
    #[account(
        seeds = [b"event", event_id.as_bytes()],
        bump = event_config.bump,
    )]
    pub event_config: Account<'info, EventConfig>,
    #[account(
        mut,
        seeds = [b"profile", user.key().as_ref()],
        bump = profile.bump,
    )]
    pub profile: Account<'info, UserProfile>,
    /// CHECK: Used only for PDA derivation of profile
    pub user: UncheckedAccount<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// ── Account Structures ──

#[account]
pub struct EventConfig {
    pub organizer: Pubkey,
    pub event_id: String,
    pub name: String,
    pub max_attendees: u32,
    pub current_attendees: u32,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}

impl EventConfig {
    pub const LEN: usize = 32 + (4 + 64) + (4 + 128) + 4 + 4 + 1 + 8 + 1;
}

#[account]
pub struct UserProfile {
    pub user: Pubkey,
    pub reputation_score: u16,
    pub badges_count: u16,
    pub total_check_ins: u32,
    pub total_matches: u32,
    pub total_reviews_given: u32,
    pub total_reviews_received: u32,
    pub interests_hash: [u8; 32],
    pub last_updated: i64,
    pub bump: u8,
}

impl UserProfile {
    pub const LEN: usize = 32 + 2 + 2 + 4 + 4 + 4 + 4 + 32 + 8 + 1;
}

#[account]
pub struct Attendance {
    pub user: Pubkey,
    pub event_id: String,
    pub checked_in: bool,
    pub timestamp: i64,
    pub bump: u8,
}

impl Attendance {
    pub const LEN: usize = 32 + (4 + 64) + 1 + 8 + 1;
}

#[account]
pub struct UserReview {
    pub reviewer: Pubkey,
    pub reviewed_user: Pubkey,
    pub event_id: String,
    pub rating: u8,
    pub comment_hash: [u8; 32],
    pub timestamp: i64,
    pub bump: u8,
}

impl UserReview {
    pub const LEN: usize = 32 + 32 + (4 + 64) + 1 + 32 + 8 + 1;
}

// ── Error Codes ──

#[error_code]
pub enum ErrorCode {
    #[msg("Event is not active")]
    EventNotActive,
    #[msg("Event is full")]
    EventFull,
    #[msg("Invalid rating, must be 1-5")]
    InvalidRating,
    #[msg("Reputation score overflow")]
    ReputationOverflow,
    #[msg("User is not checked in")]
    NotCheckedIn,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid reputation score, must be 0-100")]
    InvalidReputationScore,
    #[msg("Invalid parameter")]
    InvalidParameter,
    #[msg("Math overflow occurred")]
    MathOverflow,
}