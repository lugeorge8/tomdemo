export type Tool = {
  title: string;
  href: string;
  desc: string;
};

export const tools: Tool[] = [
  {
    title: "Portfolio commentary",
    href: "/tools/portfolio-commentary",
    desc: "Paste/upload a report, summarize it, compare to a prior report.",
  },
  {
    title: "RMD calculator",
    href: "/tools/rmd",
    desc: "Uniform Lifetime Table + compute RMD from age and assets.",
  },
  {
    title: "Team blog",
    href: "/blog",
    desc: "Internal updates with admin upload.",
  },
];
