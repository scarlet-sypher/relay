import { useEffect, useState } from "react";

import { getHealthStatus } from "../api/health.api";

interface HealthData {
  success: boolean;
  message: string;
}

const Dashboard = () => {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getHealthStatus();

        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-[500px]">
        <h1 className="text-4xl font-bold text-white mb-6">CRM Dashboard</h1>

        {loading ? (
          <p className="text-slate-400">Connecting...</p>
        ) : (
          <div>
            <div className="bg-slate-800 rounded-xl p-4 mb-4">
              <p className="text-slate-400 text-sm">STATUS</p>

              <h2 className="text-green-400 text-2xl font-bold">
                {data?.success ? "ONLINE" : "OFFLINE"}
              </h2>
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-sm">MESSAGE</p>

              <p className="text-white">{data?.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
