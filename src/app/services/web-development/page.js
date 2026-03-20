// src/app/services/web-development/page.js
// Server component — exports metadata, renders the client component
import WebDevelopmentClient from './WebDevelopmentClient';

export const metadata = {
  title: 'Web Development Services — AetherSolve Technologies',
  description: 'Custom web application development — from e-commerce to enterprise platforms. React, Next.js, Node.js experts.',
};

export default function WebDevelopmentPage() {
  return <WebDevelopmentClient />;
}