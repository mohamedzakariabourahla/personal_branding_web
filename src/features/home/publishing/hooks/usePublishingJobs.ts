import { useEffect, useState } from "react";
import { fetchPublishingJobs } from "@/features/home/publishing/api/platformApi";
import { PublishingJob } from "@/features/home/publishing/models/publishingJobModels";

export function usePublishingJobs() {
  const [jobs, setJobs] = useState<PublishingJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublishingJobs();
      setJobs(data);
    } catch {
      setError("Unable to load publishing jobs right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return { jobs, loading, error, reload: load };
}
