import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    ppr: 'incremental',
  }
};

export default withFlowbiteReact(nextConfig);