import type { Metadata } from "next";
import Home from "../page";

// The CV links here so its visits show up as their own path in Cloudflare Web Analytics, which drops query strings.
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default Home;
