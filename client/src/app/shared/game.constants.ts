export class NamedItem {
  constructor(public readonly name: string, public readonly description: string, public readonly icon?: string) {
  }
}

export class GameConstants {
  public static readonly TRAITS = [
    new NamedItem('Brawn', 'Strength and physical power.', 'fitness_center'),
    new NamedItem('Finesse', 'Coordination and agility.', 'sports_handball'),
    new NamedItem('Resolve', 'Willpower and endurance.', 'hiking'),
    new NamedItem('Wits', 'Quick thinking.', 'wb_incandescent'),
    new NamedItem('Panache', 'Charm and personal magnetism.', 'face_retouching_natural'),
  ];

  public static readonly SKILLS = [
    new NamedItem(
      'Notice',
      "Use Notice when you investigate a crime scene or search a Villain's study for clues. Use Notice when you want to pick out fine details at a glance.",
      'search'),
    new NamedItem(
      'Empathy',
      "Use Empathy when you want to tell if someone is being genuine. Use Empathy when you determine someone's general mental state: they're afraid, they're nervous, they're angry.",
      'psychology'),
    new NamedItem(
      'Convince',
      "Use Convince when you appeal to another character's better nature. Use Convince when you assure someone you're being completely honest with her and she should trust you.",
      'connect_without_contact'),
    new NamedItem(
      'Tempt', "Use Tempt when you bribe someone to do something for you that she really shouldn't agree to do. Use Tempt when you convince someone to give you a little \"alone time.\"",
      'liquor'),
    new NamedItem(
      'Intimidate',
      "Use Intimidate when you make someone do what you want under threat of some action from you, physical or otherwise.", 'groups'),
    new NamedItem(
      'Warfare',
      "Use Warfare whenever you need tactical expertise, such as when you're breaching a castle's defense. Use Warfare when you lead an army in battle.",
      'sports'),
    new NamedItem(
      'Weaponry',
      "Use Weaponry when you attack something with a sword, axe, hammer, or knife in your hand.",
      'hardware'),
    new NamedItem(
      'Aim',
      "Use Aim when you point a pistol at someone and pull the trigger. Use Aim when you throw a knife across a crowded room with pinpoint accuracy, whether your target is a person or an object.",
      'radar'),
    new NamedItem(
      'Brawl',
      "Use Brawl whenever you punch or kick someone in the face. Use Brawl when you grab someone and drag him down an alleyway.",
      'front_hand'),
    new NamedItem(
      'Athletics',
      "Use Athletics to swing across a room on a chandelier, jump from rooftop to rooftop, or otherwise perform a dangerous physical stunt.",
      'directions_run'),
    new NamedItem(
      'Theft',
      "Use Theft when you swipe something from someone's pocket without him noticing.Use Theft when you pick a lock, crack a safe, or something similar.",
      'sports_kabaddi'),
    new NamedItem(
      'Hide',
      "Use Hide when you sneak through a dark room without the guard on watch seeing you. Use Hide when you keep a weapon or other item hidden, and avoid it being found if you are searched. Use Hide to attack an unsuspecting victim with a weapon or your fists. Use Hide to construct a disguise or camouflage a location.",
      'visibility_off'
      ),
    new NamedItem(
      'Perform',
      "Use Perform when you try to captivate an audience with your showmanship. Use Perform to get across a particular message to your audience or to elicit a specific emotion from them through your performance: to make them laugh at your comedy, to make them weep at your tragedy, to rile them up with a motivational speech, etc.",
      'music_note'
    ),
    new NamedItem(
      'Scholarship',
      "Use Scholarship when you wax ecstatic about a certain subject matter, either from personal experience or teachings.Use Scholarship when you consult your knowledge to fill in the details on a certain subject. Use Scholarship when you call upon your medical training to tend to an injury.",
      'school'),
    new NamedItem(
      'Ride',
      "Use Ride when you engage in a high-speed carriage chase. Use Ride when you ride a horse through the forest at a gallop.",
      'pedal_bike'),
    new NamedItem(
      'Sailing',
      "Use Sailing whenever you navigate your way through a ship's rigging. Use Sailing when you attempt to steer a ship during a pitched battle at sea, or through a dangerously narrow channel.",
      'sailing'),
  ];
}

//const MILLIS_PER_DAY = 60 * 60 * 1000 * 24;
//const COOKIE_DURATION_DAYS = 90;
//exports.MAX_COOKIE_AGE = COOKIE_DURATION_DAYS * MILLIS_PER_DAY;
