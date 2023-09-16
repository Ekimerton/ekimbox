export function generateComedian() {
  const comedians = [
    "Mark Twain",
    "George Carlin",
    "Richard Pryor",
    "Joan Rivers",
    "Robin Williams",
    "Chris Rock",
    "Dave Chappelle",
    "Eddie Murphy",
    "Lucille Ball",
    "Jerry Seinfeld",
  ];

  const randomIndex = Math.floor(Math.random() * comedians.length);
  return comedians[randomIndex];
}

console.log(generateComedian()); // -> A random comedian name from the list
