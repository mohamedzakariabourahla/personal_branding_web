"use client";

import { Grid } from "@mui/material";
import PageContainer from "@/shared/components/layouts/PageContainer";
import Section from "@/shared/components/ui/Section";
import FeatureCard from "@/features/landingPage/components/FeatureCard";

import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CollectionsIcon from "@mui/icons-material/Collections";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import InsightsIcon from "@mui/icons-material/Insights";

const features = [
  {
    icon: <LightbulbIcon color="primary" />,
    title: "AI Video & Post Ideas",
    description:
      "Instantly generate viral ideas tailored for TikTok, Instagram, YouTube, and Facebook.",
  },
  {
    icon: <AutoAwesomeIcon color="primary" />,
    title: "Script & Caption Generator",
    description:
      "Craft scroll-stopping captions and video scripts that match your tone and audience.",
  },
  {
    icon: <CollectionsIcon color="primary" />,
    title: "Carousel & Post Designer",
    description:
      "Design beautiful social media posts and carousels with AI-assisted templates.",
  },
  {
    icon: <ScheduleSendIcon color="primary" />,
    title: "Publish & Schedule Posts",
    description:
      "Plan, schedule, and auto-publish content across all your social accounts.",
  },
  {
    icon: <InsightsIcon color="primary" />,
    title: "Performance Analytics",
    description:
      "Track engagement and growth insights across every connected platform.",
  },
];

export default function FeaturesSection() {
  return (
    <PageContainer>
      <Section
        title="What You Can Do"
        subtitle="Powerful AI tools to create, schedule, and grow your brand."
      >
        <Grid container spacing={4}>
          {features.map((feature, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </Grid>
          ))}
        </Grid>
      </Section>
    </PageContainer>
  );
}
