export const zoo =()=>{
// Feeding strategy interface
interface FeedingStrategy {
  feed(animal: Animal): void;
}

// Segregated interfaces
interface CanFly {
  fly(): void;
}

interface CanSwim {
  swim(): void;
}

interface CanHibernate {
  hibernate(): void;
}

// Abstract Animal class
abstract class Animal {
  constructor(
    public name: string,
    public species: string,
    public age: number,
    protected feedingStrategy: FeedingStrategy
  ) {}

  abstract makeSound(): void;

  feed() {
    this.feedingStrategy.feed(this);
  }
}

// Bird class
class Bird extends Animal implements CanFly {
  makeSound(): void {
    console.log(`${this.name} chirps`);
  }

  fly(): void {
    console.log(`${this.name} is flying`);
  }
}

// Mammal class
class Mammal extends Animal implements CanHibernate {
  makeSound(): void {
    console.log(`${this.name} growls`);
  }

  hibernate(): void {
    console.log(`${this.name} is hibernating`);
  }
}

// Reptile class
class Reptile extends Animal implements CanSwim {
  makeSound(): void {
    console.log(`${this.name} hisses`);
  }

  swim(): void {
    console.log(`${this.name} is swimming`);
  }
}

// Feeding Strategies
class HerbivoreFeeding implements FeedingStrategy {
  feed(animal: Animal): void {
    console.log(`${animal.name} is fed with plants`);
  }
}

class CarnivoreFeeding implements FeedingStrategy {
  feed(animal: Animal): void {
    console.log(`${animal.name} is fed with meat`);
  }
}

class OmnivoreFeeding implements FeedingStrategy {
  feed(animal: Animal): void {
    console.log(`${animal.name} is fed with both plants and meat`);
  }
}

// Habitat class with encapsulation
class Habitat {
  private temperature: number;
  private cleanliness: number;
  private feedingSchedule: string;

  constructor(temp: number, cleanliness: number, schedule: string) {
    this.temperature = temp;
    this.cleanliness = cleanliness;
    this.feedingSchedule = schedule;
  }

  getStatus() {
    return {
      temperature: this.temperature,
      cleanliness: this.cleanliness,
      feedingSchedule: this.feedingSchedule,
    };
  }

  adjustTemperature(newTemp: number) {
    this.temperature = newTemp;
    console.log(`Habitat temperature adjusted to ${newTemp}°C`);
  }

  cleanHabitat() {
    this.cleanliness = 100;
    console.log("Habitat cleaned to 100%");
  }
}

// Observer pattern interfaces
interface Observer {
  update(message: string): void;
}

// Sensor class as observable
class Sensor {
  private observers: Observer[] = [];

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  notify(message: string) {
    for (const observer of this.observers) {
      observer.update(message);
    }
  }

  detectIssue(issue: string) {
    console.log(`Sensor detected issue: ${issue}`);
    this.notify(issue);
  }
}

// Zookeeper class
class Zookeeper implements Observer {
  update(message: string): void {
    console.log(`Zookeeper received alert: ${message}`);
  }

  monitorAnimal(animal: Animal) {
    console.log(`Zookeeper is monitoring ${animal.name}`);
  }
}

// Vet class
class Vet implements Observer {
  update(message: string): void {
    console.log(`Vet received alert: ${message}`);
  }

  checkup(animal: Animal) {
    console.log(`Vet is checking ${animal.name}`);
  }
}

// ----------------------
// Demonstartion of the system
// ----------------------

const herbivore = new HerbivoreFeeding();
const carnivore = new CarnivoreFeeding();
const omnivore = new OmnivoreFeeding();

const parrot = new Bird("Polly", "Parrot", 2, herbivore);
const tiger = new Mammal("Rajah", "Tiger", 5, carnivore);
const turtle = new Reptile("Shelly", "Turtle", 100, herbivore);

const zooKeeper = new Zookeeper();
const vet = new Vet();

const healthSensor = new Sensor();
healthSensor.addObserver(zooKeeper);
healthSensor.addObserver(vet);

// Simulate animal actions
parrot.makeSound();
parrot.fly();
parrot.feed();

tiger.makeSound();
tiger.hibernate();
tiger.feed();

turtle.makeSound();
turtle.swim();
turtle.feed();

// Simulate habitat actions
const tigerHabitat = new Habitat(25, 80, "08:00 AM");
console.log("Tiger Habitat Status:", tigerHabitat.getStatus());
tigerHabitat.adjustTemperature(28);
tigerHabitat.cleanHabitat();

// Trigger sensor alert
healthSensor.detectIssue("Tiger shows signs of fatigue");
}
