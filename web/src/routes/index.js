import React from 'react';
import { Switch } from 'react-router-dom';
import Route from '~/routes/routes';
import Forbidden from '~/views/forbidden';
import Home from '~/views/home';
import Landing from '~/views/landing';
import Profiles from '~/views/profiles';
import Users from '~/views/users';
import Projects from '~/views/projects';
import CostingCenters from '~/views/costing-centers';
import ChartOfAccounts from '~/views/chart-of-accounts';
import businessPartners from '~/views/business-partners';
import Acquirers from '~/views/acquirers';
import Banks from '~/views/banks';
import BPGroups from '~/views/bp-groups';
import AccountConfigs from '~/views/account-configs';
import ConciliationAccounts from '~/views/conciliation-accounts';
import SourceMappings from '~/views/source-mappings';
import Reports from '~/views/reports';
import ReportRequests from '~/views/report-requests';
import ReportTemplates from '~/views/report-templates';
import CancellationModels from '~/views/cancellation-models';
import SalesCancellation from '~/views/sales-cancellation';
import Dashboards from '~/views/dashboards';
import CustomerCredits from '~/views/customer-credits';
import Sales from '~/views/sales';
import SalesDetail from '~/views/sales/detail-route';
import Architecture from '~/views/architecture';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Landing} />
      <Route path="/forbidden" component={Forbidden} />

      <Route path="/home" component={Home} isPrivate />

      <Route path="/users" component={Users} isPrivate />
      <Route path="/profiles" component={Profiles} isPrivate />
      <Route path="/dashboards" component={Dashboards} isPrivate />

      <Route path="/projects" component={Projects} isPrivate />
      <Route path="/costing-centers" component={CostingCenters} isPrivate />
      <Route path="/chart-of-accounts" component={ChartOfAccounts} isPrivate />
      <Route path="/business-partners" component={businessPartners} isPrivate />
      <Route path="/acquirers" component={Acquirers} isPrivate />
      <Route path="/banks" component={Banks} isPrivate />
      <Route path="/bp-groups" component={BPGroups} isPrivate />
      <Route path="/account-configs" component={AccountConfigs} isPrivate />
      <Route path="/conciliation-accounts" component={ConciliationAccounts} isPrivate />
      <Route path="/source-mappings" component={SourceMappings} isPrivate />
      <Route path="/reports" component={Reports} isPrivate />
      <Route path="/report-templates" component={ReportTemplates} isPrivate />
      <Route path="/cancellation-models" component={CancellationModels} isPrivate />
      <Route path="/sales-cancellation" component={SalesCancellation} isPrivate />
      <Route path="/report-requests" component={ReportRequests} isPrivate />

      <Route path="/customer-credits" component={CustomerCredits} isPrivate />
      <Route exact path="/sales" component={Sales} isPrivate />
      <Route exact path="/sales/:id" component={SalesDetail} isPrivate />

      <Route exact path="/architecture" component={Architecture} isPrivate />

      <Route component={Forbidden} />
    </Switch>
  );
}
