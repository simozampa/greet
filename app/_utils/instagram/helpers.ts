import { InstagramVerification, User } from "@prisma/client";
import { ApifyClient } from "apify-client";

export function getLast30DaysTimestamps(): { since: string; until: string } {
  const now = new Date();
  const untilDate = now.toISOString().slice(0, 19).replace("T", " ");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sinceDate = thirtyDaysAgo.toISOString().slice(0, 19).replace("T", " ");

  return { since: sinceDate, until: untilDate };
}

// Helper function to get the top 3 entries in an object that looks like: [key:string]: number (api response)
export function getTopEntriesByValue<T extends { [key: string]: number }>(
  data: T,
  topCount: number
) {
  const dataArray = Object.entries(data) as Array<[keyof T, T[keyof T]]>;
  dataArray.sort((a, b) => b[1] - a[1]); // Sort in descending order based on values

  const topEntries = dataArray
    .slice(0, topCount)
    .map(([key, value]) => ({ key, value }));
  return topEntries;
}

export function processInstagramApiBasicInfo(basicInfoData: any) {
  return {
    name: basicInfoData.name,
    biography: basicInfoData.biography,
    followersCount: basicInfoData.followers_count,
    profilePictureUrl: basicInfoData.profile_picture_url,
    username: basicInfoData.username,
  };
}

export function processInstagramApiDayInsights(dayInsightData: any) {
  let totalImpressions = 0;
  let totalReach = 0;
  let totalProfileViews = 0;
  let totalFollowerCount = 0;

  for (let i = 0; i < dayInsightData.length; i++) {
    const insight = dayInsightData[i];
    switch (insight.name) {
      case "impressions":
        for (let k = 0; k < insight.values.length; k++) {
          totalImpressions += insight.values[k].value;
        }
        break;
      case "reach":
        for (let k = 0; k < insight.values.length; k++) {
          totalReach += insight.values[k].value;
        }
        break;
      case "profile_views":
        for (let k = 0; k < insight.values.length; k++) {
          totalProfileViews += insight.values[k].value;
        }
        break;
      case "follower_count":
        for (let k = 0; k < insight.values.length; k++) {
          totalFollowerCount += insight.values[k].value;
        }
        break;
      default:
        break;
    }
  }

  return {
    totalImpressions: totalImpressions,
    totalReach: totalReach,
    totalProfileViews: totalProfileViews,
    totalFollowerCount: totalFollowerCount,
  };
}

export function processInstagramApiLifetimeInsights(lifetimeInsightData: any) {
  // Process lifetime Insight
  let topCountries: any = [];
  let topGenderAge: any = [];
  let topLocale: any = [];
  for (let i = 0; i < lifetimeInsightData.length; i++) {
    const insight = lifetimeInsightData[i];
    switch (insight.name) {
      case "audience_country":
        topCountries = getTopEntriesByValue(insight.values[0].value, 3);
        break;
      case "audience_gender_age":
        topGenderAge = getTopEntriesByValue(insight.values[0].value, 3);
        break;
      case "audience_locale":
        topLocale = getTopEntriesByValue(insight.values[0].value, 3);
        break;
      default:
        break;
    }
  }

  return {
    topCountries: topCountries,
    topGenderAge: topGenderAge,
    topLocale: topLocale,
  };
}

/**
 * Scrapes an Instagram account by username with APIFY.
 * If the scraper was successful and the followers count is >= minFollowersCount
 * (5k by default), it will return true
 * Otherwise it will return false
 */
export async function basicInstagramFollowerCheck(
  instagramHandle: string,
  minFollowersCount: number = 5000
): Promise<boolean> {
  try {
    const client = new ApifyClient({
      token: process.env.APIFY_API_KEY,
    });

    const input = {
      usernames: [instagramHandle],
    };

    // Run the Actor and wait for it to finish
    const run = await client
      .actor("apify/instagram-profile-scraper")
      .call(input);

    // Fetch and print Actor results from the run's dataset (if any)
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (items.length === 0) {
      return false;
    }

    const account = items[0];
    const followersCount = (account["followersCount"] as number) ?? -1;

    if (followersCount >= minFollowersCount) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error while running the scraper: ", error);
    return false;
  }
}
