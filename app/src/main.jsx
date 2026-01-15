import React from 'react';
import { createRoot } from 'react-dom/client';
import CalendarWidget from './CalendarWidget';
import './index.css';

// 1. Find all widget containers
const widgets = document.querySelectorAll('.calendar-widget');

// 2. Loop through each one
widgets.forEach((element) => {
  // 3. Read configuration from HTML
  const view = element.dataset.view;

  console.log('Mounting calendar with view:', view);

  // 4. Mount React into THIS element
  const root = createRoot(element);
  root.render(<CalendarWidget view={view} />);
});
