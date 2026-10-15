export interface SensorData {
  soilMoisture: number; // percentage
  waterPurity: number; // percentage
  biomassDensity: number; // tons/ha
  carbonOffset: number; // tons CO2e sequestered
  netZeroIndex: number; // score 0-100
}

export interface JournalEntry {
  id: string;
  date: string;
  author: string;
  avatar?: string;
  content: string;
  category: "soil" | "water" | "planting" | "community" | "general";
  proofOnChain: string; // IPFS / Blockchain Tx Hash
  verified: boolean;
  auditorCertified?: boolean;
}

export interface Task {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  assignee: string;
}

export interface PropertyDocument {
  id: string;
  name: string;
  type: "permit" | "deed" | "survey" | "blueprint";
  status: "approved" | "pending" | "review";
  date: string;
  hash: string;
  auditorCertified?: boolean;
}

export interface WireTransaction {
  id: string;
  from: string;
  to: string;
  amount: string; // e.g. "45,000 USDC" or "2.4 ETH"
  purpose: string;
  status: "completed" | "pending";
  hash: string;
  auditorCertified?: boolean;
}

export interface LandProperty {
  id: string;
  name: string;
  steward: string;
  location: string;
  tagline: string;
  description: string;
  image: string;
  established: string;
  areaAcres: number;
  sensorData: SensorData;
  journal: JournalEntry[];
  tasks: Task[];
  documents: PropertyDocument[];
  wires: WireTransaction[];
  dataSharingLevel?: "public" | "permissioned" | "private";
  stewardBio?: string;
  stewardResponseTime?: string;
  stewardKeyTier?: "Silver Seed" | "Golden Leaf" | "Emerald Root";
}

export interface MarketplaceListing {
  id: string;
  title: string;
  type: "land" | "service" | "professional" | "technology";
  provider: string;
  location: string;
  price: string;
  description: string;
  image: string;
  tags: string[];
  supplierRating?: number;
  supplierResponseTime?: string;
  supplierVerified?: boolean;
}

export interface StewardshipKey {
  id: string;
  name: string;
  holder: string;
  tier: "Silver Seed" | "Golden Leaf" | "Emerald Root";
  multiplier: number;
  unlockedAt: string;
  rewardsClaimed: string;
  description: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface InquiryMessage {
  id: string;
  sender: string;
  senderRole?: string;
  text: string;
  timestamp: string;
  isStewardOrSupplier?: boolean;
  quoteDetails?: {
    price: string;
    timeline?: string;
    status: "quoted" | "accepted" | "declined";
  };
}

export interface StewardInquiry {
  id: string;
  propertyId: string;
  propertyName: string;
  stewardName: string;
  senderName: string;
  senderContact: string;
  topic: "volunteering" | "research" | "indigenous" | "funding" | "general";
  status: "sent" | "acknowledged" | "replied";
  unreadReplies?: number;
  createdAt: string;
  messages: InquiryMessage[];
}

export interface SupplierInquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  supplierName: string;
  senderName: string;
  senderContact: string;
  inquiryType: "quote" | "specs" | "logistics" | "partnership";
  scopeOrQuantity?: string;
  status: "inquiry_sent" | "quote_provided" | "accepted" | "completed";
  unreadReplies?: number;
  createdAt: string;
  messages: InquiryMessage[];
}

