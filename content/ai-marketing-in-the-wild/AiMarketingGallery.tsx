const observations = [
  {
    title: 'Fussball WM Public Viewing',
    location: 'Zell am See',
    note: 'It is the clones of the same guy with glasses that give this one away. One clone is also watching his clones watch the game. Like Agent Smith in The Matrix Revolutions, but pretending to enjoy a game of football.',
    image: '/static/images/ai-marketing-in-the-wild/01-football-public-viewing.webp',
    alt: 'A football World Cup public viewing poster photographed in Zell am See',
    width: 1500,
    height: 2000
  },
  {
    title: 'Sweet piece from our heart. Waffle makers.',
    location: 'Zell am See',
    note: 'It looks delicious at first glance, but what is that strawberry doing, morphing into a blackberry? And what is with the honey-like texture of the syrup?',
    image: '/static/images/ai-marketing-in-the-wild/02-waffle-makers.webp',
    alt: 'A Waffle Makers advertisement showing an AI-generated waffle and fruit',
    width: 1500,
    height: 2000
  },
  {
    title: 'Thai five',
    location: 'Zell am See',
    note: '“It is the same guy, having dinner with himself. Can you make the dude on the right look different?” “Sure, I will add a beard. It is a completely different human now!”',
    image: '/static/images/ai-marketing-in-the-wild/03-thai-five.webp',
    alt: 'A Thai restaurant poster showing two nearly identical AI-generated diners',
    width: 1500,
    height: 1125
  },
  {
    title: 'Chicken Shawarma',
    location: 'Zell am See',
    note: 'Our shawarma is made by AI.',
    image: '/static/images/ai-marketing-in-the-wild/04-chicken-shawarma.webp',
    alt: 'A chicken shawarma restaurant sign with AI-generated food photography',
    width: 1500,
    height: 2000
  },
  {
    title: 'Wanted. Dog owner with money in his pockets.',
    location: 'Zell am See',
    note: 'This dog does not exist.',
    image: '/static/images/ai-marketing-in-the-wild/05-wanted-dog-owner.webp',
    alt: 'A rack of wanted-style dog souvenir posters made with AI-generated portraits',
    width: 1500,
    height: 2000
  },
  {
    title: 'CETO barbershop',
    location: 'Zell am See',
    note: 'I wonder what they are using the scissor-comb for?',
    image: '/static/images/ai-marketing-in-the-wild/06-ceto-barbershop.webp',
    alt: 'A barbershop sign with an AI-generated barber holding an impossible scissor comb',
    width: 1500,
    height: 2000
  },
  {
    title: 'Summer Park Bier Fest',
    location: 'Desenzano',
    note: 'Three AI-generated beers for the price of one.',
    image: '/static/images/ai-marketing-in-the-wild/07-summer-park-bierfest.webp',
    alt: 'A Summer Park Bier Fest poster featuring AI-generated glasses of beer',
    width: 1500,
    height: 2000
  },
  {
    title: 'Tribute to Vasco Rossi',
    location: 'Lake Garda',
    note: 'Our band is real. Stay away from the skewer though. It is AI-generated.',
    image: '/static/images/ai-marketing-in-the-wild/08-vasco-rossi.webp',
    alt: 'A Vasco Rossi tribute band poster with an AI-generated food skewer',
    width: 1500,
    height: 2000
  },
  {
    title: 'Le Family Bar',
    location: 'Chamonix, France',
    note: 'We serve Aperol Spritz, mojito and pints of Hainaksen!',
    image: '/static/images/ai-marketing-in-the-wild/09-le-family-bar.webp',
    alt: 'A summer happy hour sign with illustrated AI-generated drinks',
    width: 1500,
    height: 2000
  },
  {
    title: 'GalopPêche',
    location: 'Lake Geneva',
    note: 'Those fish look pretty scary. Did they eat his legs?',
    image: '/static/images/ai-marketing-in-the-wild/10-galopeche.webp',
    alt: 'A fishing advertisement showing an AI-generated angler standing among huge fish',
    width: 1500,
    height: 2000
  },
  {
    title: 'Firefighter’s Ball, with fireworks!',
    location: 'Lake Geneva',
    note: 'With all the fires across Europe this summer, this seems like an unlikely event. The only thing that is clearly AI-generated here is the beer. Again.',
    image: '/static/images/ai-marketing-in-the-wild/11-firefighters-ball.webp',
    alt: 'A firefighters ball poster combining fireworks, flames and AI-generated beer',
    width: 1500,
    height: 2000
  },
  {
    title: 'Rescue Festival',
    location: 'Lake Geneva',
    note: 'The duck - or cormorant? - caught my attention, but the four human clones rowing the boat gave it away. The AI forgot to put a beard or moustache on them to make them look like “unique” humans.',
    image: '/static/images/ai-marketing-in-the-wild/12-rescue-festival.webp',
    alt: 'A rescue festival poster with a cartoon bird and four nearly identical rowers',
    width: 1500,
    height: 2000
  },
  {
    title: 'Corsier-Port Heritage Days 2026',
    location: 'Lake Geneva',
    note: 'I had to ask AI what this one was about. My kids were sure it was AI-generated, but apparently it was made by an art collective called Plonk & Replonk-Bébert, who are well-known for their absurdist photomontages.',
    image: '/static/images/ai-marketing-in-the-wild/13-corsier-port-heritage.webp',
    alt: 'An absurdist Corsier-Port Heritage Days poster showing people and objects flying over a harbour',
    width: 1500,
    height: 2000
  }
];

export function AiMarketingGallery() {
  return (
    <div className="not-prose my-10 w-full">
      <div className="flex flex-col gap-10 md:gap-12">
        {observations.map((observation, index) => (
          <figure key={observation.title} className="m-0">
            <img
              src={observation.image}
              alt={observation.alt}
              width={observation.width}
              height={observation.height}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
              sizes="(min-width: 1024px) 486px, (min-width: 768px) calc((100vw - 232px) * 0.75), calc(100vw - 2rem)"
              className="m-0 block h-auto w-full rounded-sm bg-slate-200 dark:bg-slate-800"
            />
            <figcaption className="mt-4">
              <h2 className="nimbus m-0 text-xl leading-tight text-slate-900 dark:text-slate-100">
                {observation.title}
              </h2>
              <p className="mt-1 mb-0 text-sm text-slate-500 dark:text-slate-400">{observation.location}</p>
              <p className="mt-3 mb-0 leading-relaxed text-slate-700 dark:text-slate-300">{observation.note}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
