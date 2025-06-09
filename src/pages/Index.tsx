
import Header from "@/components/Header";
import RaffleHero from "@/components/RaffleHero";
import NumberSelector from "@/components/NumberSelector";
import VipGroup from "@/components/VipGroup";
import PrizeNumbers from "@/components/PrizeNumbers";
import Footer from "@/components/Footer";

const Index = () => {
  console.log("Index page rendering");
  
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <RaffleHero />
        <NumberSelector />
        <VipGroup />
        <PrizeNumbers />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
