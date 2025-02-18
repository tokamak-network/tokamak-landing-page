"use client";

import { formatDistanceToNow } from "date-fns";

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true }); // "4 days ago" 형식으로 반환
};

export function NewsDate({ dateString }: { dateString: string }) {
  // const formatDate = (dateString: string) => {
  //   try {
  //     const date = new Date(dateString);
  //     return new Intl.DateTimeFormat("en-US", {
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //     }).format(date);
  //   } catch (error) {
  //     console.error("Error formatting date:", error);
  //     return dateString;
  //   }
  // };

  return (
    <span className="text-gray-500">{formatRelativeTime(dateString)}</span>
  );
}
