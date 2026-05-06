import HeroSection from "../components/HeroSection";
import MenuSection from "../components/MenuSection";
import BeansPage from "./BeansPage";
import StoryPage from "./StoryPage";
import FeedbackPage from "./FeedbackPage";
import ContactCare from "./ContactPage";
import Footer from "../components/Footer";
import BrandTopBar from "../components/BrandTopBar";
import FAQ from "../pages/FAQ";

function Landing() {
  return (
    <div className="h-screen overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <HeroSection />

      <div id="menu-section">
        <MenuSection />
      </div>
      <StoryPage />
      <BeansPage />
      <FeedbackPage />
      <FAQ />
      <ContactCare />
      <BrandTopBar />
      <Footer />
    </div>
  );
}

export default Landing;
