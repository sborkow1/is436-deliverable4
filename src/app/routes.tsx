import { createBrowserRouter } from 'react-router';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { RecordPage } from './pages/RecordPage';
import { RetrievePage } from './pages/RetrievePage';

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  { path: '/login', Component: LoginPage },
  { path: '/register', Component: RegisterPage },
  { path: '/dashboard', Component: DashboardPage },
  { path: '/record', Component: RecordPage },
  { path: '/retrieve', Component: RetrievePage },
]);
