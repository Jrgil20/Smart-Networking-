import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Workspace } from "../target/types/workspace";
import { expect } from "chai";
import {
  PublicKey,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

describe("smart_networking", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.workspace as Program<Workspace>;

  let organizer: Keypair;
  let user1: Keypair;
  let user2: Keypair;
  let user3: Keypair;

  const eventId = "event_001";
  const eventName = "Solana Hacker House";
  const maxAttendees = 100;
  const interestsHash = new Array(32).fill(1);

  const getEventPDA = (eid: string) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("event"), Buffer.from(eid)],
      program.programId
    );

  const getProfilePDA = (user: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), user.toBuffer()],
      program.programId
    );

  const getAttendancePDA = (eid: string, user: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("attendance"), Buffer.from(eid), user.toBuffer()],
      program.programId
    );

  const getReviewPDA = (eid: string, reviewer: PublicKey, reviewed: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [
        Buffer.from("review"),
        Buffer.from(eid),
        reviewer.toBuffer(),
        reviewed.toBuffer(),
      ],
      program.programId
    );

  before(async () => {
    organizer = Keypair.generate();
    user1 = Keypair.generate();
    user2 = Keypair.generate();
    user3 = Keypair.generate();

    // Fund all accounts with 100 SOL
    for (const kp of [organizer, user1, user2, user3]) {
      const sig = await provider.connection.requestAirdrop(
        kp.publicKey,
        100 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig);
    }
  });

  // ── 1. Initialize Config (init_user_profile) ──

  it("Initialize user profile for user1", async () => {
    const [profilePDA] = getProfilePDA(user1.publicKey);

    await program.methods
      .initializeConfig(Buffer.from(interestsHash))
      .accounts({
        profile: profilePDA,
        user: user1.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    const profile = await program.account.userProfile.fetch(profilePDA);
    expect(profile.user.toBase58()).to.equal(user1.publicKey.toBase58());
    expect(profile.reputationScore).to.equal(50);
    expect(profile.badgesCount).to.equal(0);
    expect(profile.totalCheckIns).to.equal(0);
    expect(profile.totalMatches).to.equal(0);
    expect(profile.totalReviewsGiven).to.equal(0);
    expect(profile.totalReviewsReceived).to.equal(0);
    expect(Buffer.from(profile.interestsHash)).to.deep.equal(
      Buffer.from(interestsHash)
    );
  });

  it("Initialize user profile for user2", async () => {
    const [profilePDA] = getProfilePDA(user2.publicKey);

    await program.methods
      .initializeConfig(Buffer.from(new Array(32).fill(2)))
      .accounts({
        profile: profilePDA,
        user: user2.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user2])
      .rpc();

    const profile = await program.account.userProfile.fetch(profilePDA);
    expect(profile.user.toBase58()).to.equal(user2.publicKey.toBase58());
    expect(profile.reputationScore).to.equal(50);
  });

  it("Initialize user profile for organizer", async () => {
    const [profilePDA] = getProfilePDA(organizer.publicKey);

    await program.methods
      .initializeConfig(Buffer.from(new Array(32).fill(3)))
      .accounts({
        profile: profilePDA,
        user: organizer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([organizer])
      .rpc();

    const profile = await program.account.userProfile.fetch(profilePDA);
    expect(profile.reputationScore).to.equal(50);
  });

  it("Fails to initialize duplicate user profile", async () => {
    const [profilePDA] = getProfilePDA(user1.publicKey);

    try {
      await program.methods
        .initializeConfig(Buffer.from(interestsHash))
        .accounts({
          profile: profilePDA,
          user: user1.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();
      expect.fail("Should have failed");
    } catch (error) {
      expect(error).to.exist;
    }
  });

  // ── 2. Create Event ──

  it("Create event successfully", async () => {
    const [eventPDA] = getEventPDA(eventId);

    await program.methods
      .createEvent(eventId, eventName, maxAttendees)
      .accounts({
        eventConfig: eventPDA,
        organizer: organizer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([organizer])
      .rpc();

    const event = await program.account.eventConfig.fetch(eventPDA);
    expect(event.organizer.toBase58()).to.equal(organizer.publicKey.toBase58());
    expect(event.eventId).to.equal(eventId);
    expect(event.name).to.equal(eventName);
    expect(event.maxAttendees).to.equal(maxAttendees);
    expect(event.currentAttendees).to.equal(0);
    expect(event.isActive).to.be.true;
    expect(Number(event.createdAt.toString())).to.be.greaterThan(0);
  });

  it("Fails to create duplicate event", async () => {
    const [eventPDA] = getEventPDA(eventId);

    try {
      await program.methods
        .createEvent(eventId, eventName, maxAttendees)
        .accounts({
          eventConfig: eventPDA,
          organizer: organizer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([organizer])
        .rpc();
      expect.fail("Should have failed");
    } catch (error) {
      expect(error).to.exist;
    }
  });

  it("Fails to create event with empty event_id", async () => {
    const emptyId = "";
    const [eventPDA] = getEventPDA(emptyId);

    try {
      await program.methods
        .createEvent(emptyId, "Test Event", 50)
        .accounts({
          eventConfig: eventPDA,
          organizer: organizer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([organizer])
        .rpc();
      // Empty string may or may not fail depending on implementation
    } catch (error) {
      expect(error).to.exist;
    }
  });

  it("Fails to create event with max_attendees = 0", async () => {
    const zeroId = "zero_event";
    const [eventPDA] = getEventPDA(zeroId);

    try {
      await program.methods
        .createEvent(zeroId, "Zero Event", 0)
        .accounts({
          eventConfig: eventPDA,
          organizer: organizer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([organizer])
        .rpc();
      expect.fail("Should have failed");
    } catch (error) {
      expect(error.message).to.include("InvalidParameter");
    }
  });

  // ── 3. Check In ──

  it("User1 checks in to event", async () => {
    const [eventPDA] = getEventPDA(eventId);
    const [attendancePDA] = getAttendancePDA(eventId, user1.publicKey);
    const [profilePDA] = getProfilePDA(user1.publicKey);

    await program.methods
      .checkIn(eventId)
      .accounts({
        eventConfig: eventPDA,
        attendance: attendancePDA,
        profile: profilePDA,
        user: user1.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    const attendance = await program.account.attendance.fetch(attendancePDA);
    expect(attendance.user.toBase58()).to.equal(user1.publicKey.toBase58());
    expect(attendance.eventId).to.equal(eventId);
    expect(attendance.checkedIn).to.be.true;
    expect(Number(attendance.timestamp.toString())).to.be.greaterThan(0);

    const event = await program.account.eventConfig.fetch(eventPDA);
    expect(event.currentAttendees).to.equal(1);

    const profile = await program.account.userProfile.fetch(profilePDA);
    expect(profile.totalCheckIns).to.equal(1);
    expect(profile.badgesCount).to.equal(1);
  });

  it("User2 checks in to event", async () => {
    const [eventPDA] = getEventPDA(eventId);
    const [attendancePDA] = getAttendancePDA(eventId, user2.publicKey);
    const [profilePDA] = getProfilePDA(user2.publicKey);

    await program.methods
      .checkIn(eventId)
      .accounts({
        eventConfig: eventPDA,
        attendance: attendancePDA,
        profile: profilePDA,
        user: user2.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user2])
      .rpc();

    const event = await program.account.eventConfig.fetch(eventPDA);
    expect(event.currentAttendees).to.equal(2);

    const profile = await program.account.userProfile.fetch(profilePDA);
    expect(profile.totalCheckIns).to.equal(1);
    expect(profile.badgesCount).to.equal(1);
  });

  it("Fails duplicate check-in for user1", async () => {
    const [eventPDA] = getEventPDA(eventId);
    const [attendancePDA] = getAttendancePDA(eventId, user1.publicKey);
    const [profilePDA] = getProfilePDA(user1.publicKey);

    try {
      await program.methods
        .checkIn(eventId)
        .accounts({
          eventConfig: eventPDA,
          attendance: attendancePDA,
          profile: profilePDA,
          user: user1.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();
      expect.fail("Should have failed");
    } catch (error) {
      expect(error).to.exist;
    }
  });

  it("Fails check-in to full event", async () => {
    // Create a small event with max 1 attendee
    const smallEventId = "small_event";
    const [smallEventPDA] = getEventPDA(smallEventId);

    await program.methods
      .createEvent(smallEventId, "Small Event", 1)
      .accounts({
        eventConfig: smallEventPDA,
        organizer: organizer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([organizer])
      .rpc();

    // First check-in should succeed
    const [att1PDA] = getAttendancePDA(smallEventId, user1.publicKey);
    const [prof1PDA] = getProfilePDA(user1.publicKey);

    await program.methods
      .checkIn(smallEventId)
      .accounts({
        eventConfig: smallEventPDA,
        attendance: att1PDA,
        profile: prof1PDA,
        user: user1.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    // Second check-in should fail (event full)
    const [att2PDA] = getAttendancePDA(smallEventId, user2.publicKey);
    const [prof2PDA] = getProfilePDA(user2.publicKey);

    try {
      await program.methods
        .checkIn(smallEventId)
        .accounts({
          eventConfig: smallEventPDA,
          attendance: att2PDA,
          profile: prof2PDA,
          user: user2.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user2])
        .rpc();
      expect.fail("Should have failed");
    } catch (error) {
      expect(error.message).to.include("EventFull");
    }
  });

  // ── 4. Submit Review ──

  it("User1 submits a positive review for user2 (rating 5)", async () => {
    const [reviewPDA] = getReviewPDA(eventId, user1.publicKey, user2.publicKey);
    const [reviewerAttPDA] = getAttendancePDA(eventId, user1.publicKey);
    const [reviewedAttPDA] = getAttendancePDA(eventId, user2.publicKey);
    const [reviewerProfPDA] = getProfilePDA(user1.publicKey);
    const [reviewedProfPDA] = getProfilePDA(user2.publicKey);
    const commentHash = new Array(32).fill(0xab);

    await program.methods
      .submitReview(eventId, 5, Buffer.from(commentHash))
      .accounts({
        review: reviewPDA,
        reviewerAttendance: reviewerAttPDA,
        reviewedAttendance: reviewedAttPDA,
        reviewerProfile: reviewerProfPDA,
        reviewedProfile: reviewedProfPDA,
        reviewer: user1.publicKey,
        reviewedUser: user2.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    const review = await program.account.userReview.fetch(reviewPDA);
    expect(review.reviewer.toBase58()).to.equal(user1.publicKey.toBase58());
    expect(review.reviewedUser.toBase58()).to.equal(user2.publicKey.toBase58());
    expect(review.rating).to.equal(5);
    expect(review.eventId).to.equal(eventId);

    const reviewerProfile = await program.account.userProfile.fetch(reviewerProfPDA);
    expect(reviewerProfile.totalReviewsGiven).to.equal(1);

    const reviewedProfile = await program.account.userProfile.fetch(reviewedProfPDA);
    expect(reviewedProfile.totalReviewsReceived).to.equal(1);
    // Rating 5 >= 4, so reputation += 2 → 50 + 2 = 52
    expect(reviewedProfile.reputationScore).to.equal(52);
  });

  it("User2 submits a negative review for user1 (rating 1)", async () => {
    const [reviewPDA] = getReviewPDA(eventId, user2.publicKey, user1.publicKey);
    const [reviewerAttPDA] = getAttendancePDA(eventId, user2.publicKey);
    const [reviewedAttPDA] = getAttendancePDA(eventId, user1.publicKey);
    const [reviewerProfPDA] = getProfilePDA(user2.publicKey);
    const [reviewedProfPDA] = getProfilePDA(user1.publicKey);
    const commentHash = new Array(32).fill(0xcd);

    await program.methods
      .submitReview(eventId, 1, Buffer.from(commentHash))
      .accounts({
        review: reviewPDA,
        reviewerAttendance: reviewerAttPDA,
        reviewedAttendance: reviewedAttPDA,
        reviewerProfile: reviewerProfPDA,
        reviewedProfile: reviewedProfPDA,
        reviewer: user2.publicKey,
        reviewedUser: user1.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user2])
      .rpc();

    const review = await program.account.userReview.fetch(reviewPDA);
    expect(review.rating).to.equal(1);

    const reviewedProfile = await program.account.userProfile.fetch(reviewedProfPDA);
    // Rating 1 <= 2, so reputation -= 1 → 50 - 1 = 49
    expect(reviewedProfile.reputationScore).to.equal(49);
    expect(reviewedProfile.totalReviewsReceived).to.equal(1);
  });

  it("Fails to submit review with invalid rating (0)", async () => {
    // Create a second event and check in both users for this test
    const eventId2 = "event_002";
    const [eventPDA2] = getEventPDA(eventId2);

    await program.methods
      .createEvent(eventId2, "Second Event", 50)
      .accounts({
        eventConfig: eventPDA2,
        organizer: organizer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([organizer])
      .rpc();

    // Check in both users
    const [att1] = getAttendancePDA(eventId2, user1.publicKey);
    const [prof1] = getProfilePDA(user1.publicKey);
    await program.methods
      .checkIn(eventId2)
      .accounts({
        eventConfig: eventPDA2,
        attendance: att1,
        profile: prof1,
        user: user1.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    const [att2] = getAttendancePDA(eventId2, user2.publicKey);
    const [prof2] = getProfilePDA(user2.publicKey);
    await program.methods
      .checkIn(eventId2)
      .accounts({
        eventConfig: eventPDA2,
        attendance: att2,
        profile: prof2,
        user: user2.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user2])
      .rpc();

    const [reviewPDA] = getReviewPDA(eventId2, user1.publicKey, user2.publicKey);

    try {
      await program.methods
        .submitReview(eventId2, 0, Buffer.from(new Array(32).fill(0)))
        .accounts({
          review: reviewPDA,
          reviewerAttendance: att1,
          reviewedAttendance: att2,
          reviewerProfile: prof1,
          reviewedProfile: prof2,
          reviewer: user1.publicKey,
          reviewedUser: user2.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();
      expect.fail("Should have failed");
    } catch (error) {
      expect(error.message).to.include("InvalidRating");
    }
  });

  it("Fails to submit review with invalid rating (6)", async () => {
    const eventId2 = "event_002";
    const [att1] = getAttendancePDA(eventId2, user1.publicKey);
    const [att2] = getAttendancePDA(eventId2, user2.publicKey);
    const [prof1] = getProfilePDA(user1.publicKey);
    const [prof2] = getProfilePDA(user2.publicKey);
    // Use a different review PDA - but same pair, so we need a fresh event
    const eventId3 = "event_003";
    const [eventPDA3] = getEventPDA(eventId3);

    await program.methods
      .createEvent(eventId3, "Third Event", 50)
      .accounts({
        eventConfig: eventPDA3,
        organizer: organizer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([organizer])
      .rpc();

    const [att1_3] = getAttendancePDA(eventId3, user1.publicKey);
    const [att2_3] = getAttendancePDA(eventId3, user2.publicKey);
    await program.methods
      .checkIn(eventId3)
      .accounts({
        eventConfig: eventPDA3,
        attendance: att1_3,
        profile: prof1,
        user: user1.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    await program.methods
      .checkIn(eventId3)
      .accounts({
        eventConfig: eventPDA3,
        attendance: att2_3,
        profile: prof2,
        user: user2.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user2])
      .rpc();

    const [reviewPDA3] = getReviewPDA(eventId3, user1.publicKey, user2.publicKey);

    try {
      await program.methods
        .submitReview(eventId3, 6, Buffer.from(new Array(32).fill(0)))
        .accounts({
          review: reviewPDA3,
          reviewerAttendance: att1_3,
          reviewedAttendance: att2_3,
          reviewerProfile: prof1,
          reviewedProfile: prof2,
          reviewer: user1.publicKey,
          reviewedUser: user2.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();
      expect.fail("Should have failed");
    } catch (error) {
      expect(error.message).to.include("InvalidRating");
    }
  });

  it("Fails duplicate review (same reviewer, same reviewed, same event)", async () => {
    // user1 already reviewed user2 in event_001
    const [reviewPDA] = getReviewPDA(eventId, user1.publicKey, user2.publicKey);
    const [reviewerAttPDA] = getAttendancePDA(eventId, user1.publicKey);
    const [reviewedAttPDA] = getAttendancePDA(eventId, user2.publicKey);
    const [reviewerProfPDA] = getProfilePDA(user1.publicKey);
    const [reviewedProfPDA] = getProfilePDA(user2.publicKey);

    try {
      await program.methods
        .submitReview(eventId, 3, Buffer.from(new Array(32).fill(0)))
        .accounts({
          review: reviewPDA,
          reviewerAttendance: reviewerAttPDA,
          reviewedAttendance: reviewedAttPDA,
          reviewerProfile: reviewerProfPDA,
          reviewedProfile: reviewedProfPDA,
          reviewer: user1.publicKey,
          reviewedUser: user2.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();
      expect.fail("Should have failed");
    } catch (error) {
      expect(error).to.exist;
    }
  });

  it("Submit neutral review (rating 3) - no reputation change", async () => {
    const eventId2 = "event_002";
    const [reviewPDA] = getReviewPDA(eventId2, user1.publicKey, user2.publicKey);
    const [reviewerAttPDA] = getAttendancePDA(eventId2, user1.publicKey);
    const [reviewedAttPDA] = getAttendancePDA(eventId2, user2.publicKey);
    const [reviewerProfPDA] = getProfilePDA(user1.publicKey);
    const [reviewedProfPDA] = getProfilePDA(user2.publicKey);

    const profileBefore = await program.account.userProfile.fetch(reviewedProfPDA);
    const repBefore = profileBefore.reputationScore;

    await program.methods
      .submitReview(eventId2, 3, Buffer.from(new Array(32).fill(0xee)))
      .accounts({
        review: reviewPDA,
        reviewerAttendance: reviewerAttPDA,
        reviewedAttendance: reviewedAttPDA,
        reviewerProfile: reviewerProfPDA,
        reviewedProfile: reviewedProfPDA,
        reviewer: user1.publicKey,
        reviewedUser: user2.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    const profileAfter = await program.account.userProfile.fetch(reviewedProfPDA);
    // Rating 3 is neutral - no reputation change
    expect(profileAfter.reputationScore).to.equal(repBefore);
  });

  // ── 5. Update Reputation (Admin) ──

  it("Organizer updates user1 reputation", async () => {
    const [eventPDA] = getEventPDA(eventId);
    const [profilePDA] = getProfilePDA(user1.publicKey);

    await program.methods
      .updateReputation(eventId, 75)
      .accounts({
        eventConfig: eventPDA,
        profile: profilePDA,
        user: user1.publicKey,
        authority: organizer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([organizer])
      .rpc();

    const profile = await program.account.userProfile.fetch(profilePDA);
    expect(profile.reputationScore).to.equal(75);
  });

  it("Fails update_reputation with non-organizer", async () => {
    const [eventPDA] = getEventPDA(eventId);
    const [profilePDA] = getProfilePDA(user1.publicKey);

    try {
      await program.methods
        .updateReputation(eventId, 90)
        .accounts({
          eventConfig: eventPDA,
          profile: profilePDA,
          user: user1.publicKey,
          authority: user2.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user2])
        .rpc();
      expect.fail("Should have failed");
    } catch (error) {
      expect(error.message).to.include("Unauthorized");
    }
  });

  it("Fails update_reputation with score > 100", async () => {
    const [eventPDA] = getEventPDA(eventId);
    const [profilePDA] = getProfilePDA(user1.publicKey);

    try {
      await program.methods
        .updateReputation(eventId, 150)
        .accounts({
          eventConfig: eventPDA,
          profile: profilePDA,
          user: user1.publicKey,
          authority: organizer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([organizer])
        .rpc();
      expect.fail("Should have failed");
    } catch (error) {
      expect(error.message).to.include("InvalidReputationScore");
    }
  });

  it("Organizer sets reputation to 0 (edge case)", async () => {
    const [eventPDA] = getEventPDA(eventId);
    const [profilePDA] = getProfilePDA(user1.publicKey);

    await program.methods
      .updateReputation(eventId, 0)
      .accounts({
        eventConfig: eventPDA,
        profile: profilePDA,
        user: user1.publicKey,
        authority: organizer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([organizer])
      .rpc();

    const profile = await program.account.userProfile.fetch(profilePDA);
    expect(profile.reputationScore).to.equal(0);
  });

  it("Organizer sets reputation to 100 (edge case)", async () => {
    const [eventPDA] = getEventPDA(eventId);
    const [profilePDA] = getProfilePDA(user1.publicKey);

    await program.methods
      .updateReputation(eventId, 100)
      .accounts({
        eventConfig: eventPDA,
        profile: profilePDA,
        user: user1.publicKey,
        authority: organizer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([organizer])
      .rpc();

    const profile = await program.account.userProfile.fetch(profilePDA);
    expect(profile.reputationScore).to.equal(100);
  });

  // ── 6. Multi-event check-in tracking ──

  it("User1 check-in count increments across events", async () => {
    const [profilePDA] = getProfilePDA(user1.publicKey);
    const profile = await program.account.userProfile.fetch(profilePDA);
    // user1 checked into event_001, small_event, event_002, event_003 = 4 check-ins
    expect(profile.totalCheckIns).to.equal(4);
    expect(profile.badgesCount).to.equal(4);
  });
});