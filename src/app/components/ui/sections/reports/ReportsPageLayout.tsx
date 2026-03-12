"use client";

export default function ReportsPageLayout({
  title,
  subtitle,
  contentClassName = "max-w-[800px]",
  children,
}: {
  title: React.ReactNode;
  subtitle: string;
  contentClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      <div className="flex justify-center w-full pt-[200px] pb-[40px] px-6">
        <div className="flex flex-col items-center text-center gap-y-3">
          <h1 className="text-[38px] md:text-[48px] font-[900] text-white uppercase tracking-[0.06em]">
            {title}
          </h1>
          <p className="text-[16px] text-[#929298]">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-col items-center pb-[120px]">
        <div className={`w-full px-6 flex flex-col ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
