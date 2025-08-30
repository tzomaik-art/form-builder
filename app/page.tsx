import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-6">
            Form Builder
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Create beautiful, conversion-optimized forms for your Shopify store
          </p>
          
          <div className="space-x-4">
            <Link href="/admin">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                Open Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-2xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Drag & Drop Builder
            </h3>
            <p className="text-white/80">
              Create stunning forms with our intuitive drag and drop interface
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-2xl mb-4">🆔</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Auto-Generated IDs
            </h3>
            <p className="text-white/80">
              Unique Bestellnummer IDs automatically created for each customer
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-2xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Multi-Language
            </h3>
            <p className="text-white/80">
              Support for English, German, and Greek languages
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}