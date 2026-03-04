export type Tool = {
  title: string;
  href: string;
  desc: string;
};

export const tools: Tool[] = [
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
