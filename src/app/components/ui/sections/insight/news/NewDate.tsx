"use client";

export function NewsDate({ dateString }: { dateString: string }) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return <span className="text-gray-500">{formatDate(dateString)}</span>;
}
