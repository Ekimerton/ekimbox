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

export function generateAnonymousName() {
  const names = [
    "Hidden Hero",
    "Mystery Guest",
    "Shadow Dancer",
    "Secret Explorer",
    "Invisible Jester",
    "Silent Knight",
    "Sneaky Panda",
    "Whispering Willow",
    "Incognito Artist",
    "Camouflaged Star",
    "Covert Comet",
    "Undercover Unicorn",
    "Veiled Voyager",
    "Masked Musician",
    "Cloaked Clown",
    "Anonymous Astronaut",
    "Undetected Detective",
    "Stealthy Stallion",
    "Elusive Elf",
    "Unseen Dreamer",
  ];

  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}
