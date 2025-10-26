'use client';

import { Grid } from '@mui/material';
import PageContainer from '@/shared/components/layouts/PageContainer';
import Section from '@/shared/components/ui/Section';
import FeatureCard from '@/features/landingPage/components/FeatureCard';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CollectionsIcon from '@mui/icons-material/Collections';
import InsightsIcon from '@mui/icons-material/Insights';

const features = [
  {
    icon: <LightbulbIcon color="primary" />,
    title: 'AI Video Ideas',
    description: 'Generate TikTok & Reels ideas aligned with your personal brand.',
  },
  {
    icon: <AutoAwesomeIcon color="primary" />,
    title: 'Script Generation',
    description: 'Create captivating video scripts optimized for virality.',
  },
  {
    icon: <CollectionsIcon color="primary" />,
    title: 'Carousel Builder',
    description: 'Design carousels for Instagram with AI-assisted templates.',
  },
  {
    icon: <InsightsIcon color="primary" />,
    title: 'Analytics Dashboard',
    description: 'Track engagement and performance across your platforms.',
  },
];

export default function FeaturesSection() {
  return (
    <PageContainer>
      <Section title="What You Can Do" subtitle="Explore AI-powered tools for your brand.">
        <Grid container spacing={4}>
          {features.map((feature, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
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
