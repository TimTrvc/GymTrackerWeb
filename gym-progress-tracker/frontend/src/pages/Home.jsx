import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '@/context/AuthContext';
import HeroSection from '@/components/layout/HeroSection';
import { FaDumbbell, FaChartLine, FaUserFriends, FaMobileAlt, FaHeart } from 'react-icons/fa';
import { MdSportsGymnastics, MdFoodBank } from 'react-icons/md';
import { RiBodyScanFill, RiMedalFill } from 'react-icons/ri';
import { GiSwordWound } from 'react-icons/gi';
import { getNutritionLogs } from '@/services/nutritionLogsService';
import HomeAvatarWidget from '@/components/features/avatar/HomeAvatarWidget';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [nutritionData, setNutritionData] = useState({
    calories: 0,
    protein_grams: 0,
    carbs_grams: 0,
    fat_grams: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch nutrition data for today
  useEffect(() => {
    const fetchNutritionData = async () => {
      if (isAuthenticated) {
        try {
          setIsLoading(true);
          const logs = await getNutritionLogs();
          
          // Get today's date in YYYY-MM-DD format
          const today = new Date().toISOString().split('T')[0];
          
          // Filter logs for today's date
          const todaysLogs = logs.filter(log => {
            const logDate = new Date(log.log_date);
            const year = logDate.getFullYear();
            const month = String(logDate.getMonth() + 1).padStart(2, '0');
            const day = String(logDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate === today;
          });
          
          // Calculate totals from today's logs
          const totals = todaysLogs.reduce((acc, log) => {
            acc.calories += Number(log.calories) || 0;
            acc.protein_grams += Number(log.protein_grams) || 0;
            acc.carbs_grams += Number(log.carbs_grams) || 0;
            acc.fat_grams += Number(log.fat_grams) || 0;
            return acc;
          }, { calories: 0, protein_grams: 0, carbs_grams: 0, fat_grams: 0 });
          
          setNutritionData(totals);
        } catch (error) {
          console.error('Error fetching nutrition data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchNutritionData();
  }, [isAuthenticated]);

  // Define a set of features/benefits to display
  const features = [
    {
      icon: <FaDumbbell className="h-8 w-8 text-indigo-500" />,
      title: 'Übungsdatenbank',
      description: 'Zugriff auf eine umfangreiche Bibliothek von Übungen mit detaillierten Anleitungen.'
    },
    {
      icon: <MdSportsGymnastics className="h-8 w-8 text-indigo-500" />,
      title: 'Workout-Planung',
      description: 'Erstelle und speichere deine individuellen Trainingspläne für maximale Effizienz.'
    },
    {
      icon: <FaChartLine className="h-8 w-8 text-indigo-500" />,
      title: 'Fortschrittsverfolgung',
      description: 'Verfolge deine Trainingsfortschritte mit detaillierten Statistiken und Grafiken.'
    },
    {
      icon: <RiBodyScanFill className="h-8 w-8 text-indigo-500" />,
      title: 'Körpermessung',
      description: 'Dokumentiere deine Körpermaße und beobachte deine körperlichen Veränderungen.'
    }
  ];

  // Quick access links for authenticated users
  const quickLinks = [
    { icon: <FaDumbbell />, title: 'Übungen', href: '/exercises', color: 'bg-blue-500' },
    { icon: <MdSportsGymnastics />, title: 'Workouts', href: '/workouts', color: 'bg-purple-500' },
    { icon: <MdFoodBank />, title: 'Ernährung', href: '/nutrition', color: 'bg-green-500' },
    { icon: <RiBodyScanFill />, title: 'Körpermaße', href: '/body', color: 'bg-orange-500' },
    { icon: <FaChartLine />, title: 'Statistiken', href: '/statistics', color: 'bg-pink-500' }
  ];

  const testimonials = [
    {
      quote: "GymTrack hat mir geholfen, meine Workouts zu strukturieren und meinen Fortschritt zu visualisieren.",
      name: "Max M.",
      role: "Fitness-Enthusiast"
    },
    {
      quote: "Endlich eine App, die alle wichtigen Fitness-Aspekte in einer Oberfläche vereint!",
      name: "Laura K.",
      role: "Athletin"
    }
  ];

  return (
    <>
      <HeroSection
        title="Verfolge deinen Fitness-Fortschritt"
        subtitle="Mit GymTrack kannst du deine Workouts protokollieren, Fortschritte verfolgen und deine Fitnessziele erreichen."
        button={
          !isAuthenticated && (
            <Link
              to="/login"
              className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-100 transition shadow-lg hover:shadow-xl"
            >
              Jetzt starten
            </Link>
          )
        }
        size="large"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Dashboard for Authenticated Users */}
        {isAuthenticated && (
          <>
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Schnellzugriff</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickLinks.map((link, index) => (
                  <Link 
                    to={link.href} 
                    key={index}
                    className={`${link.color} hover:opacity-90 text-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 flex flex-col items-center`}
                  >
                    <div className="text-4xl mb-4">{link.icon}</div>
                    <h3 className="text-xl font-bold">{link.title}</h3>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mb-12 bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-xl shadow-md">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-2/3 mb-6 md:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Dein heutiges Training</h2>
                  <p className="text-gray-600 mb-6">Starte dein Workout oder erstelle einen neuen Trainingsplan.</p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/workouts" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
                      Workout starten
                    </Link>
                    <Link to="/exercises" className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition">
                      Übungen ansehen
                    </Link>
                  </div>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <RiMedalFill className="h-32 w-32 text-indigo-500 opacity-80" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Tägliche Ernährung</h3>
                {isLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Heutige Kalorien</span>
                      <span className="font-bold text-xl">{nutritionData.calories} kcal</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ 
                          width: nutritionData.calories > 0 ? `${Math.min(nutritionData.calories / 20)}%` : '0%' 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center border-b pb-3">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <MdFoodBank className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Protein</p>
                        <p className="text-sm text-gray-500">{nutritionData.protein_grams} g</p>
                      </div>
                      <div className="w-1/3 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full" 
                          style={{ width: nutritionData.protein_grams > 0 ? `${Math.min(nutritionData.protein_grams, 100)}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center border-b pb-3">
                      <div className="bg-yellow-100 p-2 rounded-full mr-3">
                        <MdFoodBank className="text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Kohlenhydrate</p>
                        <p className="text-sm text-gray-500">{nutritionData.carbs_grams} g</p>
                      </div>
                      <div className="w-1/3 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-yellow-500 h-1.5 rounded-full" 
                          style={{ width: nutritionData.carbs_grams > 0 ? `${Math.min(nutritionData.carbs_grams / 2, 100)}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <MdFoodBank className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Fette</p>
                        <p className="text-sm text-gray-500">{nutritionData.fat_grams} g</p>
                      </div>
                      <div className="w-1/3 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full" 
                          style={{ width: nutritionData.fat_grams > 0 ? `${Math.min(nutritionData.fat_grams * 2, 100)}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <Link to="/nutrition" className="block mt-6 text-indigo-600 hover:text-indigo-800 font-medium">
                  Ernährung verwalten →
                </Link>
              </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Dein Avatar</h3>
                <HomeAvatarWidget />
                <Link to="/avatar" className="block mt-6 text-indigo-600 hover:text-indigo-800 font-medium">
                  Avatar anpassen →
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Content for Non-Authenticated Users */}
        {!isAuthenticated && (
          <>
            {/* Features Section */}
            <section className="py-16">
              <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center text-center">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Benefits Section with Image */}
            <section className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl my-12">
              <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center">
                  <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Warum GymTrack?</h2>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Einfaches Tracking deiner Trainingsfortschritte</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Personalisierte Workoutpläne für deine Ziele</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Behalte deine Ernährung und Körpermaße im Blick</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Motivierende Übersichten und Statistiken</span>
                      </li>
                    </ul>
                    <div className="mt-8">
                      <Link
                        to="/login"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
                      >
                        Jetzt anmelden
                      </Link>
                    </div>
                  </div>
                  <div className="lg:w-1/2 flex justify-center">
                    <div className="relative">
                      <div className="absolute -top-6 -left-6 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                      <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                      <div className="absolute -bottom-6 left-12 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                      <div className="relative">
                        <div className="bg-white p-6 rounded-2xl shadow-xl">
                          <div className="flex items-center justify-center h-64 w-64 overflow-hidden">
                            <FaUserFriends className="h-48 w-48 text-indigo-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-16">
              <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Was unsere Nutzer sagen</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((item, index) => (
                  <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                    <svg className="h-8 w-8 text-indigo-400 mb-4" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="text-gray-600 italic mb-4">{item.quote}</p>
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-gray-500 text-sm">{item.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <div className="bg-indigo-700 text-white p-12 rounded-xl shadow-lg text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Bereit deine Fitness auf das nächste Level zu bringen?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Melde dich noch heute an und starte deinen Weg zu einem gesünderen und fitteren Leben mit GymTrack!
              </p>
              <Link
                to="/login"
                className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-100 transition inline-block"
              >
                Kostenlos registrieren
              </Link>
            </div>

            {/* Compatibility/Mobile Section */}
            <section className="py-12 flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Überall nutzbar</h2>
                <p className="text-gray-600 mb-6">
                  GymTrack funktioniert auf allen Geräten - egal ob am Computer zuhause oder unterwegs auf dem Smartphone.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="bg-indigo-100 p-6 rounded-full">
                  <FaMobileAlt className="h-24 w-24 text-indigo-500" />
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
