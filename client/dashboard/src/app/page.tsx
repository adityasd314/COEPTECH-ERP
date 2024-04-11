import FeaturedCourses from "@/components/FeaturedCourses";
import HeroSection from "@/components/HeroSection";
import MusicSchoolTestimonials from "@/components/TestimonialCards";
import WhyChooseUs from "@/components/WhyChooseUs";
import Notices from "../../../../utils/Notices/Notices";


export default function Home() {
  return (
    <main className="min-h-screen bg-white/[0.96] antialiased bg-grid-white/[0.02]">

          <HeroSection/>
          <FeaturedCourses/>
          <Notices/>

          {/* <MusicSchoolTestimonials/> */}
    </main>
  );
}
