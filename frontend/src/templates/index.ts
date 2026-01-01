import React from "react";
import ModernTemplate from "./ModernTemplate";
import ClassicTemplate from "./ClassicTemplate";
import MinimalTemplate from "./MinimalTemplate";
import CardGridTemplate from "./CardGridTemplate";
import CarouselTemplate from "./CarouselTemplate";
import GradientTemplate from "./GradientTemplate";

export interface Testimonial {
  id: string;
  name: string;
  email: string;
  content: string;
  image: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<{ testimonials: Testimonial[] }>;
}

const templates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    description: "A sleek, contemporary design with smooth animations and clean typography. Perfect for modern brands.",
    component: ModernTemplate,
  },
  {
    id: "classic",
    name: "Classic",
    description: "A timeless, elegant design with traditional styling. Ideal for professional and corporate use.",
    component: ClassicTemplate,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design that focuses on content. Great for minimalist brands.",
    component: MinimalTemplate,
  },
  {
    id: "card-grid",
    name: "Card Grid",
    description: "Beautiful card-based layout in a responsive grid. Perfect for showcasing multiple testimonials.",
    component: CardGridTemplate,
  },
  {
    id: "carousel",
    name: "Carousel",
    description: "An interactive carousel that cycles through testimonials with smooth transitions.",
    component: CarouselTemplate,
  },
  {
    id: "gradient",
    name: "Gradient",
    description: "Vibrant gradient design with dynamic colors and modern animations.",
    component: GradientTemplate,
  },
];

export function getAllTemplates(): Template[] {
  return templates;
}

export function getTemplate(id: string): Template {
  const template = templates.find((t) => t.id === id);
  if (!template) {
    return templates[0]; // Return default template if not found
  }
  return template;
}

