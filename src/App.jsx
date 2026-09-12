import React from 'react';
import { useDoc, useCollection } from './firebase/useContent';
import * as d from './firebase/defaults';
import { useReveal } from './hooks/useReveal';
import { useIsMobile } from './hooks/useIsMobile';
import { c } from './styles';

import Header from './components/Header';
import CallFab from './components/CallFab';
import Hero from './components/Hero';
import Services from './components/Services';
import PriceCalculator from './components/PriceCalculator';
import Appointment from './components/Appointment';
import Reviews from './components/Reviews';
import Coverage from './components/Coverage';
import Store from './components/Store';
import Contact from './components/Contact';
import Faq from './components/Faq';
import Footer from './components/Footer';

export default function App() {
  useReveal();
  const isMobile = useIsMobile();

  const site = useDoc('site', d.site);
  const hero = useDoc('hero', d.hero);
  const pricing = useDoc('pricing', d.pricing);
  const rating = useDoc('rating', d.rating);
  const services = useCollection('services', d.services);
  const provinces = useCollection('provinces', d.provinces);
  const products = useCollection('products', d.products);
  const faqs = useCollection('faqs', d.faqs);
  const reviews = useCollection('reviews', d.reviews);

  return (
    <div style={{ minHeight: '100vh', background: c.bg }}>
      <Header site={site} isMobile={isMobile} />
      <CallFab site={site} isMobile={isMobile} />
      <Hero hero={hero} />
      <Services services={services} />
      <PriceCalculator pricing={pricing} cities={d.cities} />
      <Appointment site={site} />
      <Reviews reviews={reviews} rating={rating} site={site} />
      <Coverage provinces={provinces} isMobile={isMobile} />
      <Store products={products} />
      <Contact site={site} />
      <Faq faqs={faqs} />
      <Footer site={site} />
    </div>
  );
}
