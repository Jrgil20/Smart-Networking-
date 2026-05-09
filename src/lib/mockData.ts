// ============================================================
// Smart Networking - Mock Data
// Mirrors on-chain PDA structures for seamless future migration
// ============================================================

export interface UserProfile {
  wallet: string;
  reputationScore: number; // 0-100
  badgesCount: number;
  totalCheckIns: number;
  totalMatches: number;
  totalReviewsGiven: number;
  totalReviewsReceived: number;
  interests: string[];
  lastUpdated: number; // timestamp
}

export interface EventConfig {
  eventId: string;
  name: string;
  description: string;
  organizer: string;
  organizerName: string;
  date: string;
  location: string;
  attendeesCount: number;
  maxAttendees: number;
  tags: string[];
  imageUrl?: string;
  lumaUrl?: string; // Optional URL to linked Luma event
  status: 'upcoming' | 'live' | 'past';
  createdAt: number;
}

export interface Attendance {
  user: string;
  eventId: string;
  timestamp: number;
  checkedIn: boolean;
}

export interface MatchSuggestion {
  matchWallet: string;
  displayName: string;
  compatibilityScore: number; // 0-100
  primaryInterestMatch: string;
  sharedInterests: string[];
  suggestedTopic: string;
  reasoning: string;
  reputationScore: number;
  badgesCount: number;
  isVIP: boolean;
  isNewcomer: boolean;
}

export interface UserReview {
  reviewedUser: string;
  reviewer: string;
  eventId: string;
  rating: number; // 1-5
  comment?: string;
  timestamp: number;
  reviewedDisplayName: string;
}

export interface NFTBadge {
  eventId: string;
  eventName: string;
  mintDate: number;
  imageColor: string; // for generated badge visuals
  eventDate: string;
}

// -----------------------------------------------------------
// Mock Wallets
// -----------------------------------------------------------
const MOCK_WALLETS = {
  self: '9B4bE2wK7mPxJr8dF3nQ1hYtR6vG5cXs2aL8jN0fWpDq',
  alice: '7xJ9kL2MnOpQrStUvWxYz1A3bC4dE5fG6hI7jK8lM9nO',
  bob: '4pR7sT0uVwXyZ1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT',
  charlie: '2mN8oP9qR0sT1uV2wX3yZ4aB5cD6eF7gH8iJ9kL0mN',
  diana: '6hI7jK8lM9nO0pQ1rS2tU3vW4xY5zA6bC7dE8fG9hI',
  organizer: '3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4aB5cD6eF',
};

// -----------------------------------------------------------
// Current User Profile
// -----------------------------------------------------------
export const mockUserProfile: UserProfile = {
  wallet: MOCK_WALLETS.self,
  reputationScore: 78,
  badgesCount: 5,
  totalCheckIns: 12,
  totalMatches: 28,
  totalReviewsGiven: 9,
  totalReviewsReceived: 15,
  interests: ['AI', 'Blockchain', 'DeFi', 'Solana', 'Product Design'],
  lastUpdated: Date.now(),
};

// Empty profile for new users (when wallet is connected but has no on-chain data)
export const emptyUserProfile: UserProfile = {
  wallet: '',
  reputationScore: 0,
  badgesCount: 0,
  totalCheckIns: 0,
  totalMatches: 0,
  totalReviewsGiven: 0,
  totalReviewsReceived: 0,
  interests: [],
  lastUpdated: Date.now(),
};

// -----------------------------------------------------------
// Events
// -----------------------------------------------------------
export const mockEvents: EventConfig[] = [
  {
    eventId: 'solana-hacker-house-2025',
    name: 'Solana Hacker House 2025',
    description: 'Three days of building, networking, and workshops with the Solana ecosystem. Meet founders, developers, and investors in the space.',
    organizer: MOCK_WALLETS.organizer,
    organizerName: 'Solana Foundation',
    date: '2025-06-15',
    location: 'Miami, FL',
    attendeesCount: 234,
    maxAttendees: 300,
    tags: ['Solana', 'DeFi', 'NFTs', 'Infrastructure'],
    status: 'live',
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    eventId: 'web3-summit-latam',
    name: 'Web3 Summit LATAM',
    description: 'The largest Web3 conference in Latin America. Panels, demos, and networking focused on mass adoption across the region.',
    organizer: MOCK_WALLETS.organizer,
    organizerName: 'Web3 LATAM DAO',
    date: '2025-07-22',
    location: 'Mexico City, MX',
    attendeesCount: 0,
    maxAttendees: 500,
    tags: ['Web3', 'LATAM', 'Adoption', 'DAO'],
    status: 'upcoming',
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    eventId: 'ai-x-crypto-conf',
    name: 'AI x Crypto Conference',
    description: 'Exploring the intersection of artificial intelligence and blockchain technology. Hands-on workshops and expert panels.',
    organizer: MOCK_WALLETS.organizer,
    organizerName: 'CryptoAI Labs',
    date: '2025-08-10',
    location: 'Buenos Aires, AR',
    attendeesCount: 0,
    maxAttendees: 200,
    tags: ['AI', 'Crypto', 'ML', 'Data'],
    status: 'upcoming',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    eventId: 'defi-builders-retreat',
    name: 'DeFi Builders Retreat',
    description: 'A focused 2-day retreat for DeFi protocol builders. Small group, deep technical discussions, and real collaboration.',
    organizer: MOCK_WALLETS.organizer,
    organizerName: 'DeFi Alliance',
    date: '2025-03-20',
    location: 'Lisbon, PT',
    attendeesCount: 87,
    maxAttendees: 100,
    tags: ['DeFi', 'Yield', 'AMM', 'Lending'],
    status: 'past',
    createdAt: Date.now() - 86400000 * 90,
  },
  {
    eventId: 'nft-creators-meetup',
    name: 'NFT Creators Meetup',
    description: 'A casual meetup for NFT artists, collectors, and builders to share ideas and showcase their latest work.',
    organizer: MOCK_WALLETS.organizer,
    organizerName: 'NFT Collective',
    date: '2025-02-14',
    location: 'Berlin, DE',
    attendeesCount: 45,
    maxAttendees: 60,
    tags: ['NFTs', 'Art', 'Metaplex', 'Creators'],
    status: 'past',
    createdAt: Date.now() - 86400000 * 120,
  },
];

// -----------------------------------------------------------
// Attendance records for current user
// -----------------------------------------------------------
export const mockAttendances: Attendance[] = [
  {
    user: MOCK_WALLETS.self,
    eventId: 'solana-hacker-house-2025',
    timestamp: Date.now() - 3600000,
    checkedIn: true,
  },
  {
    user: MOCK_WALLETS.self,
    eventId: 'defi-builders-retreat',
    timestamp: Date.now() - 86400000 * 60,
    checkedIn: true,
  },
  {
    user: MOCK_WALLETS.self,
    eventId: 'nft-creators-meetup',
    timestamp: Date.now() - 86400000 * 90,
    checkedIn: true,
  },
];

// -----------------------------------------------------------
// AI Match Suggestions (per event)
// -----------------------------------------------------------
export const mockMatchesByEvent: Record<string, MatchSuggestion[]> = {
  'solana-hacker-house-2025': [
    {
      matchWallet: MOCK_WALLETS.alice,
      displayName: 'Alice.sol',
      compatibilityScore: 92,
      primaryInterestMatch: 'AI',
      sharedInterests: ['AI', 'Solana', 'DeFi'],
      suggestedTopic: 'What is your take on AI agents managing DeFi portfolios autonomously?',
      reasoning: 'Both deeply into AI + DeFi, similar reputation scores (78 vs 85), and both attended DeFi Builders Retreat.',
      reputationScore: 85,
      badgesCount: 8,
      isVIP: true,
      isNewcomer: false,
    },
    {
      matchWallet: MOCK_WALLETS.bob,
      displayName: 'Bob_dev',
      compatibilityScore: 78,
      primaryInterestMatch: 'Blockchain',
      sharedInterests: ['Blockchain', 'Solana'],
      suggestedTopic: 'How do you approach optimizing compute units in Anchor programs?',
      reasoning: 'Strong Solana builder, complementary skills (frontend vs smart contracts). Newcomer with high engagement.',
      reputationScore: 62,
      badgesCount: 3,
      isVIP: false,
      isNewcomer: true,
    },
    {
      matchWallet: MOCK_WALLETS.charlie,
      displayName: 'Charlie_vc',
      compatibilityScore: 71,
      primaryInterestMatch: 'Product Design',
      sharedInterests: ['Product Design', 'DeFi'],
      suggestedTopic: 'What UX patterns are working best for onboarding non-crypto users into DeFi?',
      reasoning: 'VC background with product focus. Diversity bonus for cross-domain perspective.',
      reputationScore: 90,
      badgesCount: 15,
      isVIP: true,
      isNewcomer: false,
    },
  ],
  'defi-builders-retreat': [
    {
      matchWallet: MOCK_WALLETS.diana,
      displayName: 'Diana_eth',
      compatibilityScore: 85,
      primaryInterestMatch: 'DeFi',
      sharedInterests: ['DeFi', 'Blockchain'],
      suggestedTopic: 'Cross-chain DeFi composability: bridges vs native multi-chain protocols?',
      reasoning: 'Both strong DeFi focus. Diana brings Ethereum perspective, great for cross-chain discussions.',
      reputationScore: 76,
      badgesCount: 6,
      isVIP: false,
      isNewcomer: false,
    },
    {
      matchWallet: MOCK_WALLETS.alice,
      displayName: 'Alice.sol',
      compatibilityScore: 80,
      primaryInterestMatch: 'AI',
      sharedInterests: ['AI', 'DeFi'],
      suggestedTopic: 'Can ML models predict impermanent loss better than static formulas?',
      reasoning: 'Recurring match. High past review scores between you two. Strong AI+DeFi synergy.',
      reputationScore: 85,
      badgesCount: 8,
      isVIP: true,
      isNewcomer: false,
    },
    {
      matchWallet: MOCK_WALLETS.bob,
      displayName: 'Bob_dev',
      compatibilityScore: 68,
      primaryInterestMatch: 'Solana',
      sharedInterests: ['Solana', 'Blockchain'],
      suggestedTopic: 'What is the best architecture for a Solana-native lending protocol?',
      reasoning: 'Complementary skills. Bob focuses on smart contract security, good for technical pairing.',
      reputationScore: 62,
      badgesCount: 3,
      isVIP: false,
      isNewcomer: true,
    },
  ],
};

// -----------------------------------------------------------
// Reviews
// -----------------------------------------------------------
export const mockReviewsReceived: UserReview[] = [
  {
    reviewedUser: MOCK_WALLETS.self,
    reviewer: MOCK_WALLETS.alice,
    eventId: 'defi-builders-retreat',
    rating: 5,
    comment: 'Incredibly insightful conversation about AI in DeFi. Would love to connect again.',
    timestamp: Date.now() - 86400000 * 55,
    reviewedDisplayName: 'Alice.sol',
  },
  {
    reviewedUser: MOCK_WALLETS.self,
    reviewer: MOCK_WALLETS.bob,
    eventId: 'nft-creators-meetup',
    rating: 4,
    comment: 'Great energy and solid technical knowledge. Helped me understand Metaplex.',
    timestamp: Date.now() - 86400000 * 85,
    reviewedDisplayName: 'Bob_dev',
  },
  {
    reviewedUser: MOCK_WALLETS.self,
    reviewer: MOCK_WALLETS.charlie,
    eventId: 'defi-builders-retreat',
    rating: 5,
    comment: 'One of the best connections at the event. Clear thinker with great product sense.',
    timestamp: Date.now() - 86400000 * 58,
    reviewedDisplayName: 'Charlie_vc',
  },
  {
    reviewedUser: MOCK_WALLETS.self,
    reviewer: MOCK_WALLETS.diana,
    eventId: 'nft-creators-meetup',
    rating: 4,
    timestamp: Date.now() - 86400000 * 88,
    reviewedDisplayName: 'Diana_eth',
  },
];

export const mockReviewsGiven: UserReview[] = [
  {
    reviewedUser: MOCK_WALLETS.alice,
    reviewer: MOCK_WALLETS.self,
    eventId: 'defi-builders-retreat',
    rating: 5,
    comment: 'Alice is brilliant. Deep AI knowledge applied to real DeFi problems.',
    timestamp: Date.now() - 86400000 * 54,
    reviewedDisplayName: 'Alice.sol',
  },
  {
    reviewedUser: MOCK_WALLETS.bob,
    reviewer: MOCK_WALLETS.self,
    eventId: 'nft-creators-meetup',
    rating: 4,
    timestamp: Date.now() - 86400000 * 84,
    reviewedDisplayName: 'Bob_dev',
  },
];

// -----------------------------------------------------------
// NFT Badges
// -----------------------------------------------------------
export const mockBadges: NFTBadge[] = [
  {
    eventId: 'solana-hacker-house-2025',
    eventName: 'Solana Hacker House 2025',
    mintDate: Date.now() - 3600000,
    imageColor: 'from-primary to-primary/60',
    eventDate: '2025-06-15',
  },
  {
    eventId: 'defi-builders-retreat',
    eventName: 'DeFi Builders Retreat',
    mintDate: Date.now() - 86400000 * 60,
    imageColor: 'from-accent to-accent/60',
    eventDate: '2025-03-20',
  },
  {
    eventId: 'nft-creators-meetup',
    eventName: 'NFT Creators Meetup',
    mintDate: Date.now() - 86400000 * 90,
    imageColor: 'from-primary to-accent',
    eventDate: '2025-02-14',
  },
  {
    eventId: 'eth-denver-2024',
    eventName: 'ETH Denver 2024',
    mintDate: Date.now() - 86400000 * 365,
    imageColor: 'from-destructive/70 to-accent/70',
    eventDate: '2024-02-28',
  },
  {
    eventId: 'breakpoint-2024',
    eventName: 'Solana Breakpoint 2024',
    mintDate: Date.now() - 86400000 * 200,
    imageColor: 'from-primary/80 to-primary/40',
    eventDate: '2024-09-20',
  },
];

// -----------------------------------------------------------
// Reviewable users for a given event (people you matched with)
// -----------------------------------------------------------
export const mockReviewableUsers: Record<string, { wallet: string; displayName: string; interests: string[] }[]> = {
  'solana-hacker-house-2025': [
    { wallet: MOCK_WALLETS.alice, displayName: 'Alice.sol', interests: ['AI', 'Solana', 'DeFi'] },
    { wallet: MOCK_WALLETS.bob, displayName: 'Bob_dev', interests: ['Blockchain', 'Solana'] },
    { wallet: MOCK_WALLETS.charlie, displayName: 'Charlie_vc', interests: ['Product Design', 'DeFi'] },
  ],
  'defi-builders-retreat': [
    { wallet: MOCK_WALLETS.diana, displayName: 'Diana_eth', interests: ['DeFi', 'Blockchain'] },
    { wallet: MOCK_WALLETS.alice, displayName: 'Alice.sol', interests: ['AI', 'DeFi'] },
  ],
};

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------
export function truncateWallet(wallet: string, chars = 4): string {
  return `${wallet.slice(0, chars)}...${wallet.slice(-chars)}`;
}

function seededValue(wallet: string, max: number, offset = 0): number {
  const seed = wallet
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return offset + (seed % max);
}

function chooseInterests(wallet: string): string[] {
  const pool = ['AI', 'Blockchain', 'DeFi', 'Solana', 'Product Design', 'NFTs', 'Security', 'Web3', 'Data', 'UX'];
  const seed = wallet
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const interests: string[] = [];

  for (let i = 0; i < pool.length && interests.length < 5; i += 1) {
    const index = (seed + i * 7) % pool.length;
    const interest = pool[index];
    if (!interests.includes(interest)) {
      interests.push(interest);
    }
  }

  return interests;
}

export function createProfileForWallet(wallet: string): UserProfile {
  // Return empty profile for connected wallet (real blockchain data)
  // This represents a new user with no on-chain history yet
  return {
    ...emptyUserProfile,
    wallet,
    lastUpdated: Date.now(),
  };
}

export function getAttendancesForWallet(wallet: string): Attendance[] {
  // Return empty array for connected wallet (real blockchain data)
  // User has no check-ins until they actually attend events
  return [];
}

export function getEventById(eventId: string): EventConfig | undefined {
  return mockEvents.find((e) => e.eventId === eventId);
}

export function isCheckedIn(eventId: string): boolean {
  return mockAttendances.some((a) => a.eventId === eventId && a.checkedIn);
}

export function getMatchesForEvent(eventId: string): MatchSuggestion[] {
  return mockMatchesByEvent[eventId] || [];
}

export function getReviewableForEvent(eventId: string) {
  return mockReviewableUsers[eventId] || [];
}