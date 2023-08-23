const words = [
    'Apple',
    'Abjure',
    'Future',
    'Picnic',
    'Agonistic',
    'Garland',
	'Protect',
    'Airline',
    'Gigantic',
    'Publish',
    'Bandit',
    'Goofy',
    'Quadrangle',
    'Banquet',
    'Government',
    'Recount',
    'Binoculars',
    'Grandnieces',
    'Redoubtable',
    'Biologist',
    'Handbook',
    'Reflection',
    'Blackboard',
    'Himself',
    'Reporter',
    'Board',
    'Indulge',
    'Ring'
];

export default async function fetchWordsSet() {
    const shuffled = words.sort(() => 0.5 - Math.random());
    const wordsSet = shuffled.slice(0, 15);

    return wordsSet;
}