import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { PageLoader } from "../common/PageLoader";
import { ErrorBoundary } from "../common/ErrorBoundary";

const Dashboard = lazy(() =>
  import("../pages/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const Customers = lazy(() =>
  import("../pages/Customers").then((m) => ({ default: m.Customers })),
);
const CustomerDetail = lazy(() =>
  import("../pages/CustomerDetail").then((m) => ({
    default: m.CustomerDetail,
  })),
);
const Segments = lazy(() =>
  import("../pages/Segments").then((m) => ({ default: m.Segments })),
);
const SegmentDetail = lazy(() =>
  import("../pages/SegmentDetail").then((m) => ({ default: m.SegmentDetail })),
);
const Campaigns = lazy(() =>
  import("../pages/Campaigns").then((m) => ({ default: m.Campaigns })),
);
const CampaignDetail = lazy(() =>
  import("../pages/CampaignDetail").then((m) => ({
    default: m.CampaignDetail,
  })),
);
const Analytics = lazy(() =>
  import("../pages/Analytics").then((m) => ({ default: m.Analytics })),
);
const AIStudio = lazy(() =>
  import("../pages/AIStudio").then((m) => ({ default: m.AIStudio })),
);
const Health = lazy(() =>
  import("../pages/Health").then((m) => ({ default: m.Health })),
);
const NotFound = lazy(() =>
  import("../pages/NotFound").then((m) => ({ default: m.NotFound })),
);

const LandingPage = lazy(() =>
  import("../pages/LandingPage").then((m) => ({ default: m.LandingPage })),
);

export const AppRouter = () => (
  <BrowserRouter>
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <PageLoader />
          </div>
        }
      >
        <Routes>
          {/* Standalone Landing Page Route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Main App Layout Routes */}
          <Route element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="segments" element={<Segments />} />
            <Route path="segments/:id" element={<SegmentDetail />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="campaigns/:id" element={<CampaignDetail />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="ai" element={<AIStudio />} />
            <Route path="health" element={<Health />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  </BrowserRouter>
);
