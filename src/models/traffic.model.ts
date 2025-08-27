import mongoose, { Types } from "mongoose";

export interface ITraffic {
  _id: Types.ObjectId;
  domain: string;
  SiteName: string;
  Title?: string;
  Description?: string;
  Category?: string;
  LargeScreenshot?: string;
  IsSmall?: boolean;
  IsDataFromGa?: boolean;
  Policy?: number;
  SnapshotDate?: Date;
  cached?: number;

  TopCountryShares?: { Country: number; CountryCode: string; Value: number }[];
  Engagments?: {
    BounceRate: number;
    Month: number;
    Year: number;
    PagePerVisit: number;
    Visits: number;
    TimeOnSite: number;
  };
  EstimatedMonthlyVisits?: Record<string, number>;

  GlobalRank?: number;
  CountryRank?: {
    Country: number;
    CountryCode: string;
    Rank: number;
  };
  CategoryRank?: {
    Rank: number | string;
    Category: string;
  };
  GlobalCategoryRank?: any;

  TrafficSources?: {
    Social: number;
    "Paid Referrals": number;
    Mail: number;
    Referrals: number;
    Search: number;
    Direct: number;
  };

  Competitors?: {
    TopSimilarityCompetitors: string[];
  };

  TopKeywords?: {
    Name: string;
    EstimatedValue: number;
    Volume: number;
    Cpc: number;
  }[];

  Countries?: {
    Code: string;
    UrlCode: string;
    Name: string;
  }[];

  Notification?: {
    Content?: string | null;
  };

  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TrafficSchema = new mongoose.Schema<ITraffic>(
  {
    domain: { type: String, required: true, index: true, unique: true },

    SiteName: String,
    Title: String,
    Description: String,
    Category: String,
    LargeScreenshot: String,
    IsSmall: Boolean,
    IsDataFromGa: Boolean,
    Policy: Number,
    SnapshotDate: Date,
    cached: Number,

    TopCountryShares: [
      {
        Country: Number,
        CountryCode: String,
        Value: Number,
      },
    ],

    Engagments: {
      BounceRate: Number,
      Month: Number,
      Year: Number,
      PagePerVisit: Number,
      Visits: Number,
      TimeOnSite: Number,
    },

    EstimatedMonthlyVisits: { type: Map, of: Number },

    GlobalRank: {
      type: Number,
    },
    CountryRank: {
      Country: Number,
      CountryCode: String,
      Rank: Number,
    },
    CategoryRank: {
      Rank: mongoose.Schema.Types.Mixed,
      Category: String,
    },
    GlobalCategoryRank: mongoose.Schema.Types.Mixed,

    TrafficSources: {
      Social: Number,
      "Paid Referrals": Number,
      Mail: Number,
      Referrals: Number,
      Search: Number,
      Direct: Number,
    },

    Competitors: {
      TopSimilarityCompetitors: [String],
    },

    TopKeywords: [
      {
        Name: String,
        EstimatedValue: Number,
        Volume: Number,
        Cpc: Number,
      },
    ],

    Countries: [
      {
        Code: String,
        UrlCode: String,
        Name: String,
      },
    ],

    Notification: {
      Content: mongoose.Schema.Types.Mixed,
    },
    fetchedAt:{
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

// optional TTL index (1 day cache expiry)
TrafficSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

export const Traffic = mongoose.model<ITraffic>("Traffic", TrafficSchema);
