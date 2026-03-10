import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth, hasPermission } from "@/lib/auth";
import { LanguageProvider } from "@/lib/language";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Checklists from "@/pages/checklists";
import Training from "@/pages/training";
import Login from "@/pages/login";
import Branches from "@/pages/branches";
import Team from "@/pages/team";
import OrganizationSettings from "@/pages/settings";
import DailyPerformance from "@/pages/daily-performance";
import BranchComparison from "@/pages/branch-comparison";
import BranchDetails from "@/pages/branch-details";
import ChecklistDetails from "@/pages/checklist-details";
import Register from "@/pages/register";
import Inbox from "@/pages/inbox";

function ProtectedRoute({ component: Component, feature }: { component: React.ComponentType; feature?: string }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (feature && user && !hasPermission(user.role, feature)) {
    return <Redirect to="/" />;
  }
  return <Component />;
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/" /> : <Login />}
      </Route>
      <Route path="/register/:code">
        <Register />
      </Route>
      <Route path="/">
        <ProtectedRoute component={Home} feature="dashboard" />
      </Route>
      <Route path="/checklists">
        <ProtectedRoute component={Checklists} feature="checklists" />
      </Route>
      <Route path="/checklists/:id">
        <ProtectedRoute component={ChecklistDetails} feature="checklists" />
      </Route>
      <Route path="/training">
        <ProtectedRoute component={Training} feature="training" />
      </Route>
      <Route path="/branches">
        <ProtectedRoute component={Branches} feature="branches" />
      </Route>
      <Route path="/branches/:id">
        <ProtectedRoute component={BranchDetails} feature="branches" />
      </Route>
      <Route path="/team">
        <ProtectedRoute component={Team} feature="team" />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={OrganizationSettings} feature="settings" />
      </Route>
      <Route path="/reports/daily">
        <ProtectedRoute component={DailyPerformance} feature="reports" />
      </Route>
      <Route path="/reports/branches">
        <ProtectedRoute component={BranchComparison} feature="reports" />
      </Route>
      <Route path="/inbox">
        <ProtectedRoute component={Inbox} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
