import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../Navigation';

const NavigationWithRouter = () => (
  <BrowserRouter>
    <Navigation />
  </BrowserRouter>
);

describe('Navigation', () => {
  test('renders navigation links', () => {
    render(<NavigationWithRouter />);
    
    expect(screen.getByText('GymApp')).toBeInTheDocument();
    expect(screen.getByText('首頁')).toBeInTheDocument();
    expect(screen.getByText('使用者管理')).toBeInTheDocument();
    expect(screen.getByText('運動動作')).toBeInTheDocument();
    expect(screen.getByText('訓練紀錄')).toBeInTheDocument();
  });

  test('logo links to home page', () => {
    render(<NavigationWithRouter />);
    
    const logoLink = screen.getByText('GymApp');
    expect(logoLink.getAttribute('href')).toBe('/');
  });

  test('navigation links have correct hrefs', () => {
    render(<NavigationWithRouter />);
    
    expect(screen.getByText('首頁').getAttribute('href')).toBe('/');
    expect(screen.getByText('使用者管理').getAttribute('href')).toBe('/users');
    expect(screen.getByText('運動動作').getAttribute('href')).toBe('/exercises');
    expect(screen.getByText('訓練紀錄').getAttribute('href')).toBe('/workouts');
  });
});