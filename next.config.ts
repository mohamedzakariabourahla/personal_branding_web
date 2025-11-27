import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.3", "pb.local", "172.20.10.2", "https://pb.local", "https://pb.local:8443"],
};

export default nextConfig;
