import type React from "react";
import { formatNumberWithCommas } from "@/utils/dataUtils";

export const isAdminOrAdminViewer = (role: string | null): boolean => {
  if (role === null) return false;
  return role === "Admin" || role === "Admin Viewer";
};

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JS month index starts from 0
  const day = date.getDate();

  // Pad with 0 if month or day is less than 10
  const monthStr = month < 10 ? "0" + month : month;
  const dayStr = day < 10 ? "0" + day : day;

  return `${year}-${monthStr}-${dayStr}`;
}

export const valueFormatter = (number: number) => `$ ${formatNumberWithCommas(number, 2)}`;

export const fetchAndSetData = async (
  fetchFunction: () => Promise<any>,
  setStateFunction: React.Dispatch<React.SetStateAction<any>>,
  errorMessage: string,
) => {
  try {
    const data = await fetchFunction();
    setStateFunction(data);
  } catch (error) {
    console.error(errorMessage, error);
    // Optionally, update UI to reflect error state for this specific data
  }
};

// Update the fillMissingDates function to handle different date formats
export const fillMissingDates = (data: any[], startDate: Date, endDate: Date, categories: string[]) => {
  const filledData = [];
  const currentDate = new Date(startDate);

  // Helper function to standardize date format
  const standardizeDate = (dateStr: string) => {
    if (dateStr.includes("-")) {
      // Already in YYYY-MM-DD format
      return dateStr;
    } else {
      // Convert "Jan 06" format
      const [month, day] = dateStr.split(" ");
      const year = new Date().getFullYear();
      const monthIndex = new Date(`${month} 01 2024`).getMonth();
      const fullDate = new Date(year, monthIndex, parseInt(day));
      return fullDate.toISOString().split("T")[0];
    }
  };

  // Create a map of existing dates for quick lookup
  const existingDates = new Map(
    data.map((item) => {
      const standardizedDate = standardizeDate(item.date);
      return [
        standardizedDate,
        {
          ...item,
          date: standardizedDate, // Store standardized date format
        },
      ];
    }),
  );

  // Iterate through each date in the range
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];

    if (existingDates.has(dateStr)) {
      // Use existing data if we have it
      filledData.push(existingDates.get(dateStr));
    } else {
      // Create an entry with zero values
      const emptyEntry: any = {
        date: dateStr,
        api_requests: 0,
        total_tokens: 0,
      };

      // Add zero values for each model/team if needed
      categories.forEach((category) => {
        if (!emptyEntry[category]) {
          emptyEntry[category] = 0;
        }
      });

      filledData.push(emptyEntry);
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledData;
};
