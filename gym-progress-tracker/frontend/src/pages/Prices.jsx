import HeroSection from '../components/layout/HeroSection';
import { CheckIcon } from '@heroicons/react/20/solid'
import { useAuth } from '@/hooks/useAuth';

const tiers = [
    {
        name: 'Free',
        id: 'tier-free',
        href: '#',
        priceMonthly: '0€',
        description: "Der perfekte Plan für alle die einfach nur ihren Fortschritt im Gym tracken wollen.",
        features: ['Workouts tracken', 'Essen tracken', 'Fortschritte anschauen', 'Mit Freunden connecten'],
        featured: false,
    },
    {
        name: 'Pro',
        id: 'tier-pro',
        href: '#',
        priceMonthly: '14.99€',
        description: 'Der Plan für alle die einen Schritt weiter gehen wollen und das ganze Spielhaft gestalten wollen.',
        features: [
            'Zugriff auf 1.000+ Workouts',
            'Eigener Avatar',
            'Ernährungskalkulation',
            'Gamification',
        ],
        featured: true,
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Prices = () => {
    const { isAuthenticated } = useAuth();
    return (
        <>
            <HeroSection
                title="Preise"
                subtitle="Wähle den passenden Plan für dich. Wähle einen günstigen Tarif, der die besten Funktionen für Motivation, Fortschritt und Spaß im Training vereint."
                background="bg-gradient-to-r from-indigo-700 to-blue-600"
                textColor="text-white"
                size="large"
            />
            <div className="relative isolate bg-white pb-12 sm:pb-16">
                <div className="mx-auto mt-4 max-w-2xl text-center">                    <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded mb-8 text-base font-medium">
                        <span className="font-bold">Hinweis:</span> Die Bezahlfunktion und Premium-Funktionen sind noch nicht implementiert. "Jetzt starten" für Pro ist aktuell ohne Funktion.
                    </div>
                </div>
                <div className="mx-auto mt-8 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-10 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
                    {tiers.map((tier, tierIdx) => (
                        <div
                            key={tier.id}
                            className={classNames(
                                tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0',
                                tier.featured
                                    ? ''
                                    : tierIdx === 0
                                        ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                                        : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
                                'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10',
                            )}
                        >
                            <h3
                                id={tier.id}
                                className={classNames(tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'text-base/7 font-semibold')}
                            >
                                {tier.name}
                            </h3>
                            <p className="mt-4 flex items-baseline gap-x-2">
                  <span
                      className={classNames(
                          tier.featured ? 'text-white' : 'text-gray-900',
                          'text-5xl font-semibold tracking-tight',
                      )}
                  >
                    {tier.priceMonthly}
                  </span>
                                <span className={classNames(tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base')}>/Monat</span>
                            </p>
                            <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base/7')}>
                                {tier.description}
                            </p>
                            <ul
                                role="list"
                                className={classNames(
                                    tier.featured ? 'text-gray-300' : 'text-gray-600',
                                    'mt-8 space-y-3 text-sm/6 sm:mt-10',
                                )}
                            >
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <CheckIcon
                                            aria-hidden="true"
                                            className={classNames(tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none')}
                                        />
                                        {feature}
                                    </li>
                                ))}
                            </ul>                            {tier.name === 'Pro' ? (
                                <button
                                    disabled
                                    className={classNames(
                                        'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold bg-indigo-500 text-white opacity-60 cursor-not-allowed',
                                        'focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10',
                                    )}
                                >
                                    Jetzt starten
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            window.location.href = '/login';
                                        }
                                    }}
                                    className={classNames(
                                        'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 ring-1 ring-indigo-200 ring-inset hover:ring-indigo-300',
                                        'focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10',
                                    )}
                                >
                                    {isAuthenticated ? 'Bereits aktiviert' : 'Jetzt starten'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Prices;