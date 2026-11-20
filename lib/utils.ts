import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts, SearchParamsProps } from "@/types";

export async function readSearchParams(query: SearchParamsProps["searchParams"]) {
  const params = await query;
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  );
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const diff = now.getTime() - createdAt.getTime();

  // Define time units in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  // Calculate the time difference in appropriate units
  if (diff < minute) {
    const seconds = Math.floor(diff / 1000);
    return `${seconds}s ago`;
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}m ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}h ago`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days}d ago`;
  } else if (diff < month) {
    const weeks = Math.floor(diff / week);
    return `${weeks}w ago`;
  } else if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months}mo ago`;
  } else {
    const years = Math.floor(diff / year);
    return `${years}y ago`;
  }
};

export const formatBigNumber = (num: number): string => {
  if (num === undefined) {
    return "-";
  } else if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return `${formattedNum}M`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return `${formattedNum}K`;
  } else {
    return num.toString();
  }
};

export const getMonthAndYear = (date: Date): string => {
  // Check if date is a valid Date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
};

interface UrlQueryParams {
  queryString: string;
  key: string;
  value: string | null;
}

/**
 * Forms a new URL query string by updating a specific key with a new value in the provided query string.
 *
 * @param {UrlQueryParams} params - The object containing the query string, the key to update, and the new value.
 * @param {string} params.queryString - The existing query string.
 * @param {string} params.key - The key to update in the query string.
 * @param {string | null} params.value - The new value to assign to the key.
 * @return {string} The new URL query string with the updated key.
 */
export const formUrlQuery = ({ queryString, key, value }: UrlQueryParams) => {
  // Parse the existing query string into an object
  const currentUrl = qs.parse(queryString);

  // Update the value of the specified key in the object
  currentUrl[key] = value;

  // Stringify the following updated object back into a query string,
  // skipping any keys with null values
  return qs.stringifyUrl(
    {
      url: window.location.pathname, // The current URL path e.g: '/questions', '/tags', '/community'
      query: currentUrl, // The updated query object
    },
    {
      skipNull: true, // Flag to skip keys with null values
    },
  );
};

interface RemoveUrlQueryParams {
  queryString: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  queryString,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(queryString);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    },
  );
};

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
};
