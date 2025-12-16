import React from "react";
import ModernTemplateComponent from "./ModernTemplate";
import ClassicTemplateComponent from "./ClassicTemplate";
import MinimalTemplateComponent from "./MinimalTemplate";
import CardTemplateComponent from "./CardTemplate";

// Template registry - easily add new templates here
export { default as ModernTemplate } from "./ModernTemplate";
export { default as ClassicTemplate } from "./ClassicTemplate";
export { default as MinimalTemplate } from "./MinimalTemplate";
export { default as CardTemplate } from "./CardTemplate";

export interface Testimonial {
  id: string;
  name: string;
  email: string;
  content: string;
  image: string;
}

export interface TemplateProps {
  testimonials: Testimonial[];
}

// Template metadata for selection UI
export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  preview: string; // Preview image or description
  component: React.ComponentType<TemplateProps>;
}

export const TEMPLATES: Record<string, TemplateMetadata> = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Dark gradient background with glassmorphism cards",
    preview: "Modern dark theme with gradient backgrounds",
    component: ModernTemplateComponent,
  },
  classic: {
    id: "classic",
    name: "Classic",
    description: "Clean white background with elegant borders",
    preview: "Classic white theme with subtle shadows",
    component: ClassicTemplateComponent,
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Ultra-minimal design with focus on content",
    preview: "Minimal design with clean typography",
    component: MinimalTemplateComponent,
  },
  card: {
    id: "card",
    name: "Card",
    description: "Colorful cards with rounded corners",
    preview: "Colorful card-based layout",
    component: CardTemplateComponent,
  },
};

// Get template component by ID
export const getTemplate = (templateId: string) => {
  return TEMPLATES[templateId] || TEMPLATES.modern;
};

// Get all available templates
export const getAllTemplates = () => {
  return Object.values(TEMPLATES);
};

