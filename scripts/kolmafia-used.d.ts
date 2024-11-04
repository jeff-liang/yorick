export declare function appearanceRates(
  location: Location,
  includeQueue?: boolean,
): {
  [monster: string]: number;
};
export declare function availableAmount(item: Item): number;
export declare function canAdventure(location: Location): boolean;
export declare function canEquip(equipment: Item): boolean;
export declare function canEquip(familiar: Familiar, item?: Item): boolean;
export declare function combatRateModifier(): number;
export declare function effectModifier(type: string, modifier: string): Effect;
export declare function effectModifier(
  type: string,
  modifier: Modifier,
): Effect;
export declare function effectModifier(item: Item, modifier: string): Effect;
export declare function effectModifier(item: Item, modifier: Modifier): Effect;
export declare function elementalResistance(element?: Element): number;
export declare function elementalResistance(monster: Monster): number;
export declare function equippedAmount(
  item: Item,
  includeAllFamiliars?: boolean,
): number;
export declare function familiarEquippedEquipment(familiar: Familiar): Item;
export declare function familiarWeight(familiar: Familiar): number;
export declare function getCampground(): {
  [item: string]: number;
};
export declare function getClanName(): string;
export declare function getCounter(label: string): number;
export declare function getMonsters(location: Location): Monster[];
export declare function getProperty(
  name: string,
  globalValue?: boolean,
): string;
export declare function getWorkshed(): Item;
export declare function haveEffect(effect: Effect): number;
export declare function haveEquipped(item: Item): boolean;
export declare function haveOutfit(outfit: string): boolean;
export declare function hiddenTempleUnlocked(): boolean;
export declare function inBadMoon(): boolean;
export declare function inHardcore(): boolean;
export declare function inebrietyLimit(): number;
export declare function initiativeModifier(): number;
export declare function isBanished(monster: Monster): boolean;
export declare function isUnrestricted(thing: Item): boolean;
export declare function isUnrestricted(thing: Skill): boolean;
export declare function isUnrestricted(thing: Familiar): boolean;
export declare function isUnrestricted(thing: string): boolean;
export declare function isWearingOutfit(outfit: string): boolean;
export declare function itemAmount(item: Item): number;
export declare function itemDropModifier(): number;
export declare function meatDropModifier(): number;
export declare function monsterLevelAdjustment(): number;
export declare function mpCost(skill: Skill): number;
export declare function myAscensions(): number;
export declare function myClass(): Class;
export declare function myDaycount(): number;
export declare function myFamiliar(): Familiar;
export declare function myHash(): string;
export declare function myHp(): number;
export declare function myInebriety(): number;
export declare function myLevel(): number;
export declare function myLocation(): Location;
export declare function myMeat(): number;
export declare function myMp(): number;
export declare function myPath(): Path;
export declare function myPathId(): number;
export declare function myPrimestat(): Stat;
export declare function mySpleenUse(): number;
export declare function myTurncount(): number;
export declare function npcPrice(item: Item): number;
export declare function numericModifier(modifier: string): number;
export declare function numericModifier(modifier: Modifier): number;
export declare function numericModifier(type: string, modifier: string): number;
export declare function numericModifier(
  type: string,
  modifier: Modifier,
): number;
export declare function numericModifier(item: Item, modifier: string): number;
export declare function numericModifier(item: Item, modifier: Modifier): number;
export declare function numericModifier(
  effect: Effect,
  modifier: string,
): number;
export declare function numericModifier(
  effect: Effect,
  modifier: Modifier,
): number;
export declare function numericModifier(skill: Skill, modifier: string): number;
export declare function numericModifier(
  skill: Skill,
  modifier: Modifier,
): number;
export declare function numericModifier(
  thrall: Thrall,
  modifier: string,
): number;
export declare function numericModifier(
  thrall: Thrall,
  modifier: Modifier,
): number;
export declare function numericModifier(
  familiar: Familiar,
  modifier: string,
  weight: number,
  item: Item,
): number;
export declare function pullsRemaining(): number;
export declare function round(val: number): number;
export declare function spleenLimit(): number;
export declare function toInt(value: string): number;
export declare function toInt(value: boolean): number;
export declare function toInt(value: number): number;
export declare function toInt(value: number): number;
export declare function toInt(value: Item): number;
export declare function toInt(value: Familiar): number;
export declare function toInt(value: Location): number;
export declare function toInt(value: Skill): number;
export declare function toInt(value: Effect): number;
export declare function toInt(value: Class): number;
export declare function toInt(value: Monster): number;
export declare function toInt(value: Thrall): number;
export declare function toInt(value: Servant): number;
export declare function toInt(value: Vykea): number;
export declare function toInt(value: Path): number;
export declare function toItem(value: string): Item;
export declare function toItem(value: number): Item;
export declare function toItem(name: string, count: number): Item;
export declare function toMonster(name: string): Monster;
export declare function toMonster(id: number): Monster;
export declare function toSlot(item: string): Slot;
export declare function toSlot(item: Item): Slot;
export declare function totalFreeRests(): number;
export declare function totalTurnsPlayed(): number;
export declare function trackCopyCount(monster: Monster): number;
export declare function trackIgnoreQueue(monster: Monster): boolean;
export declare function weaponHands(item: Item): number;
export declare function weaponType(item: Item): Stat;
export declare function weightAdjustment(): number;
