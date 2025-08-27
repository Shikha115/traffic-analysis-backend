// backend/src/controllers/traffic.controller.ts
import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { CONSTANT } from "@src/config/constants.config";
import { Traffic } from "@src/models/traffic.model";

function normalizeDomain(domain: string): string {
  try {
    domain = String(domain).trim().toLowerCase();

    if (!domain.startsWith("http")) {
      domain = "http://" + domain;
    }

    const url = new URL(domain);

    let hostname = url.hostname.replace(/^www\./, "").toLowerCase();

    // ✅ Check validity: must contain at least one dot, only valid chars
    const domainRegex = /^(?!\-)([a-z0-9\-]{1,63}\.)+[a-z]{2,}$/;
    if (!domainRegex.test(hostname)) {
      return "";
    }

    return hostname;
  } catch (e) {
    return "";
  }
}

async function getTrafficMetricsFromRapid(domain: string) {
  if (!CONSTANT.providers.rapidApiKey || !CONSTANT.providers.rapidApiHost) {
    return null;
  }

  try {
    const options = {
      method: "GET",
      url: `https://${CONSTANT.providers.rapidApiHost}/traffic`,
      params: { domain },
      headers: {
        "x-rapidapi-key": CONSTANT.providers.rapidApiKey,
        "x-rapidapi-host": CONSTANT.providers.rapidApiHost,
      },
    };

    const { data } = await axios.request(options);

    return data;
  } catch (err: any) {
    console.error("RapidAPI fetch failed:", err.response?.data || err.message);
    return err.response?.data || err.message || null;
  }
}

export const getTraffic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const domain = normalizeDomain(String(req.query.domain) || "");

    if (!domain) {
      return res
        .status(400)
        .json({ message: "domain query param is required", data: [] });
    }

    // check cache (15 mins TTL)
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);
    const cached = await Traffic.findOne({
      domain,
      fetchedAt: { $gte: fifteenMinAgo },
    }).sort({ fetchedAt: -1 });

    if (cached) {
      return res.json({ data: cached, message: "Cache hit" });
    }

    // fetch from RapidAPI
    const rapidData = await getTrafficMetricsFromRapid(domain);
    console.log("RapidAPI data:", rapidData); // log first 1000 chars
    if (!rapidData) {
      return res
        .status(500)
        .json({ message: "Failed to fetch from RapidAPI", data: [] });
    }

    // map response to schema
    const snapshot = await Traffic.create({
      domain,
      SiteName: rapidData?.SiteName,
      Title: rapidData?.Title,
      Description: rapidData?.Description,
      Category: rapidData?.Category,
      LargeScreenshot: rapidData?.LargeScreenshot,
      IsSmall: rapidData?.IsSmall,
      IsDataFromGa: rapidData?.IsDataFromGa,
      Policy: rapidData?.Policy,
      SnapshotDate: rapidData?.SnapshotDate,
      Cached: rapidData?.Cached,

      TopCountryShares: rapidData?.TopCountryShares || [],
      Engagments: rapidData?.Engagments || {},
      EstimatedMonthlyVisits: rapidData?.EstimatedMonthlyVisits || {},
      GlobalRank: rapidData?.GlobalRank?.Rank,
      CountryRank: rapidData?.CountryRank,
      CategoryRank: rapidData?.CategoryRank,
      GlobalCategoryRank: rapidData?.GlobalCategoryRank,
      TrafficSources: rapidData?.TrafficSources || {},
      Competitors: {
        TopSimilarityCompetitors:
          rapidData?.Competitors?.TopSimilarityCompetitors || [],
      },
      TopKeywords: rapidData?.TopKeywords || [],
      Countries: rapidData?.Countries || [],
      Notification: rapidData?.Notification || {},
    });

    return res.json({
      data: snapshot,
      message: "Traffic data fetched successfully",
    });
  } catch (err) {
    next(err);
  }
};
